package services

import (
	"context"
	"fmt"
	"github.com/gorilla/websocket"
	"log"
)

type User struct {
	Id               string
	IsMaster         bool
	RoomID           string          //not using
	Socket           *websocket.Conn // all messages for Socket translate to room.Broadcast
	IncomingMessages chan string     // channel for messages from room(all users) to client
}

func HandleUser(ctx context.Context, room *Room, conn *websocket.Conn, clientID string, isMaster bool) {
	user := User{
		Id:               clientID,
		IsMaster:         isMaster,
		RoomID:           room.Id,
		Socket:           conn,
		IncomingMessages: make(chan string),
	}

	user.subscribeToBroadcast()

	room.Register <- user

	//room will close conn and client.IncomingMessages after room.Unregister <- client
	defer func() {
		room.Unregister <- user
	}()

	//if isMaster {
	//	err := user.sendMessage(room.Id, RoomCreated)
	//	if err != nil {
	//		log.Println("failed to send room-created message:", err)
	//		return
	//	}
	//}

	err := user.sendMessage(room.Id, RoomCreated)
	if err != nil {
		log.Println("failed to send room-created message:", err)
		return
	}

	//sending current room.Content to new User
	user.IncomingMessages <- room.Content

	//read messages from User and push it to Broadcast
	for {
		select {
		case <-ctx.Done():
			log.Printf("user %s life time exceeded.\n", user.Id)
			return
		default:
			_, msg, err := user.Socket.ReadMessage()
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

func (u *User) sendMessage(message string, messageType MessageType) error {
	request := WsRequest{
		Type:    messageType,
		Message: message,
	}

	if err := u.Socket.WriteJSON(request); err != nil {
		return fmt.Errorf("failed to send message for user: %w", err)
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
