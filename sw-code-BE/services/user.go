package services

import (
	"context"
	"github.com/gorilla/websocket"
	"log"
	"sync"
)

type UserId string

type User struct {
	Id               UserId
	RoomID           string          //not using
	Socket           *websocket.Conn // all messages for Socket translate to room.Broadcast
	SocketMutex      *sync.Mutex
	IncomingMessages chan WsRequest // channel for messages from room(all users) to client
}

func HandleUser(ctx context.Context, room *Room, conn *websocket.Conn, userId UserId) {
	user := User{
		Id:               userId,
		RoomID:           room.Id,
		Socket:           conn,
		SocketMutex:      &sync.Mutex{},
		IncomingMessages: make(chan WsRequest),
	}

	room.Register <- user

	//room will close conn and client.IncomingMessages after room.Unregister <- client
	defer func() {
		room.Unregister <- user
	}()

	user.subscribeToIncomingMessages()
	user.IncomingMessages <- NewWsRequest(RoomCreated, room.Id)
	user.IncomingMessages <- NewWsRequest(TextMessage, room.Content)

	room.updateUsersCount()

	var message WsRequest
	//read messages from User and push it to Broadcast
	for {
		select {
		case <-ctx.Done():
			log.Printf("user %s life time exceeded.\n", user.Id)
			return
		default:
			err := user.Socket.ReadJSON(&message)
			if websocket.IsCloseError(err, websocket.CloseNormalClosure, websocket.CloseGoingAway) {
				log.Printf("user %s closed the connection: %s\n", userId, err)
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

func (u *User) subscribeToIncomingMessages() {
	go func() {
		//room will close this after room.Unregister <- client
		for msg := range u.IncomingMessages {
			if len(msg.Message) == 0 {
				continue
			}

			u.SocketMutex.Lock()
			err := u.Socket.WriteJSON(msg)
			u.SocketMutex.Unlock()
			if err != nil {
				log.Printf("failed send to client %s,\n err %s,\n msg:  %v\n", u.Id, err.Error(), msg)
			}
		}
	}()
}
