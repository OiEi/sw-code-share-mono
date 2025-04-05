package services

import (
	"context"
	"github.com/gorilla/websocket"
	"log"
)

type UserId string

type User struct {
	Id               UserId
	RoomID           string          //not using
	socket           *websocket.Conn // all messages for socket translate to room.Broadcast
	IncomingMessages chan WsRequest  // channel for messages from room(all users) to client
	IsSubscribed     bool
}

func HandleUser(ctx context.Context, room *Room, conn *websocket.Conn, userId UserId) {
	user := User{
		Id:               userId,
		RoomID:           room.Id,
		IncomingMessages: make(chan WsRequest),
		socket:           conn,
	}

	//room will close conn and client.IncomingMessages after room.Unregister <- client
	defer func() {
		room.unregisterUser(user)
	}()

	user.subscribeToIncomingMessages()
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
			if websocket.IsCloseError(err, websocket.CloseNormalClosure, websocket.CloseGoingAway) ||
				websocket.IsUnexpectedCloseError(err, websocket.CloseAbnormalClosure) {
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
	u.IsSubscribed = true
	go func() {
		//room will close this after room.Unregister <- client
		for msg := range u.IncomingMessages {
			if len(msg.Message) == 0 {
				continue
			}

			err := u.socket.WriteJSON(msg)
			if err != nil {
				log.Printf("failed send to client %s,\n err %s,\n msg:  %v\n", u.Id, err.Error(), msg)
			}

			if websocket.IsCloseError(err, websocket.CloseNormalClosure, websocket.CloseGoingAway) {
				log.Printf("user %s socket.WriteJSON for closed\n", u.Id)
				err = u.socket.Close()
				if err != nil {
					log.Printf("failed close socket for user %s: %s\n", u.Id, err)
				}
				
				return
			}
		}
	}()
}
