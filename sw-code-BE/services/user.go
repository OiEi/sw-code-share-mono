package services

import (
	"context"
	"fmt"
	"github.com/gorilla/websocket"
	"log"
)

type User struct {
	Id               string
	RoomID           string //not using
	Socket           *websocket.Conn
	IncomingMessages chan string // channel for messages from room to client
}

func HandleUser(ctx context.Context, room *Room, conn *websocket.Conn, clientID string) {
	user := User{
		Id:               clientID,
		RoomID:           room.Id,
		Socket:           conn,
		IncomingMessages: make(chan string),
	}

	room.Register <- user

	//room will close conn and client.IncomingMessages after room.Unregister <- client
	defer func() {
		room.Unregister <- user
	}()

	err := user.sendRoomIdMessage(room.Id)
	if err != nil {
		log.Println("failed to send room-created message:", err)
		return
	}

	user.subscribeToBroadcast()

	//sending current room.Content to new User
	user.IncomingMessages <- room.Content

	//read messages from User and push it to Broadcast
	for {
		select {
		case <-ctx.Done():
			log.Printf("user %s life time exceeded.\n", user.Id)
			return
		default:
			_, msg, err := conn.ReadMessage()
			if websocket.IsCloseError(err, websocket.CloseNormalClosure, websocket.CloseGoingAway) {
				log.Printf("user %s closed the connection: %s\n", clientID, err)
				return
			}

			if err != nil {
				log.Printf("err conn.ReadMessage() from user %s: - %s\n", clientID, err)
				return
			}

			log.Printf("message received from room %s for user %s: - %s\n", room.Id, clientID, string(msg))

			room.Broadcast <- string(msg)
		}
	}
}

func (u *User) sendRoomIdMessage(roomId string) error {
	//sending room.Id to new User for room sharing
	response := struct {
		Type   string //пока не нужно
		RoomId string `json:"roomId"`
	}{
		Type:   "room-created",
		RoomId: roomId,
	}

	if err := u.Socket.WriteJSON(response); err != nil {
		return fmt.Errorf("failed to send room-created message: %w", err)
	}

	return nil
}

// subscribeToBroadcast subscribe to broadcast to receive messages
func (u *User) subscribeToBroadcast() {
	go func() {
		//room will close this after room.Unregister <- client
		for msg := range u.IncomingMessages {
			if len(msg) == 0 {
				continue
			}

			err := u.Socket.WriteMessage(websocket.TextMessage, []byte(msg))
			if err != nil {
				log.Printf("failed to send: %s, to client %s: , - %s\n\n", msg, u.Id, err.Error())
			}
		}
	}()
}
