package services

import (
	"context"
	"github.com/gorilla/websocket"
	"log"
	"sync"
	"sync/atomic"
)

type UserId string

type User struct {
	mu sync.Mutex

	Id               UserId
	IsAuthorizedUser bool
	Ctx              context.Context
	done             chan struct{}
	IncomingMessages chan WsRequest // channel for messages from room(all users) to client
	IsSocketOpen     *atomic.Bool
	socket           *websocket.Conn // all messages for socket translate to room.Broadcast
}

func NewUser(ctx context.Context, id UserId, isAuthorize bool, conn *websocket.Conn) *User {
	return &User{
		Id:               id,
		IsAuthorizedUser: isAuthorize,
		Ctx:              ctx,
		IncomingMessages: make(chan WsRequest),
		IsSocketOpen:     &atomic.Bool{},
		done:             make(chan struct{}),
		socket:           conn,
	}
}

func (u *User) Handle(room *Room) {
	user := *u
	defer func() {
		room.unregisterUser(user)
	}()

	user.subscribeToIncomingMessages(room)
	room.registerUser(user)

	user.IncomingMessages <- NewWsRequest(RoomCreated, room.Id)
	user.IncomingMessages <- NewWsRequest(TextMessage, room.Content)

	var message WsRequest
	//read messages from User and push it to Broadcast
	for {
		select {
		case <-user.Ctx.Done():
			log.Printf("user %s life time exceeded.\n", user.Id)
			return
		case <-user.done:
			log.Printf("user %s life time canceled.\n", user.Id)
			return
		default:
			err := user.socket.ReadJSON(&message)
			if websocket.IsCloseError(err, websocket.CloseNormalClosure, websocket.CloseGoingAway, websocket.CloseAbnormalClosure) {
				log.Printf("user %s closed the connection: %s\n", user.Id, err)
				err = user.Stop()
				if err != nil {
					log.Printf("user %s stop err: %s\n", user.Id, err)
				}
				return
			}

			if err != nil {
				log.Printf("err conn.ReadMessage() from user %s: - %s\n", user.Id, err)
				continue
			}

			log.Printf("message received from room %s for user %s: - %v\n", room.Id, user.Id, message)

			if message.Type != TextMessage {
				continue
			}

			room.Broadcast <- message
		}
	}
}

func (u *User) Stop() error {
	select {
	case <-u.done:
		return nil
	default:
		u.IsSocketOpen.Store(false) //может в ошибке надо делать return...
		close(u.IncomingMessages)
		close(u.done) // сигнализируем о завершении
		return u.socket.Close()
	}
}

func (u *User) subscribeToIncomingMessages(room *Room) {
	u.IsSocketOpen.Store(true)
	go func() {
		for msg := range u.IncomingMessages {
			if len(msg.Message) == 0 {
				continue
			}

			err := u.socket.WriteJSON(msg)
			if err != nil {
				log.Printf("failed send to client %s, err %s, msg:  %v\n", u.Id, err.Error(), msg)
			}

			if websocket.IsCloseError(err, websocket.CloseNormalClosure, websocket.CloseGoingAway, websocket.CloseAbnormalClosure) {
				err = u.Stop()
				if err != nil {
					log.Printf("user %s stop err: %s\n", u.Id, err)
				}

				return
			}
		}
	}()
}
