package services

import (
	"context"
	"github.com/gorilla/websocket"
	"log"
	"sync/atomic"
)

type UserId string

type User struct {
	Id               UserId
	IncomingMessages chan WsRequest // channel for messages from room(all users) to client
	IsSocketOpen     *atomic.Bool
	socket           *websocket.Conn // all messages for socket translate to room.Broadcast
}

func HandleUser(ctx context.Context, room *Room, conn *websocket.Conn, userId UserId) {
	user := User{
		Id:               userId,
		IncomingMessages: make(chan WsRequest),
		IsSocketOpen:     &atomic.Bool{},
		socket:           conn,
	}

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
		case <-ctx.Done():
			log.Printf("user %s life time exceeded.\n", user.Id)
			return
		default:
			err := user.socket.ReadJSON(&message)
			if websocket.IsCloseError(err, websocket.CloseNormalClosure, websocket.CloseGoingAway, websocket.CloseAbnormalClosure) {
				log.Printf("user %s closed the connection: %s\n", userId, err)
				user.unregister()
				return
			}

			if err != nil {
				log.Printf("err conn.ReadMessage() from user %s: - %s\n", userId, err)
				continue
			}

			log.Printf("message received from room %s for user %s: - %v\n", room.Id, userId, message)

			if message.Type != TextMessage {
				continue
			}

			room.Broadcast <- message
		}
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
				log.Printf("user %s try write to closed socket\n", u.Id)
				u.unregister()
				return
			}
		}
	}()
}

func (u *User) unregister() {
	u.IsSocketOpen.Store(false)
	close(u.IncomingMessages)
	_ = u.socket.Close()
}
