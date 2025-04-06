package handlers

import (
	"context"
	"github.com/google/uuid"
	"github.com/gorilla/websocket"
	"log"
	"net/http"
	"sw-code-interview/services"
	"time"
)

const (
	_userLifetime = 2 * time.Hour
)

var Upgrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool { return true },
}

// WsHandler find/create room, start user worker
func WsHandler() func(http.ResponseWriter, *http.Request) {
	return func(w http.ResponseWriter, r *http.Request) {
		conn, err := createWSConnection(w, r)
		if err != nil {
			log.Printf("cant createWSConnection: %s", err)
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		}

		roomId := r.URL.Query().Get("roomId")
		userId := uuid.New().String()

		log.Printf("create new ws, userId: %s, urlRoomId %s\n", userId, roomId)

		room, err := services.GetRoom(roomId)
		if err != nil {
			log.Printf("cant get room for roomId %s\n", roomId)
			http.Error(w, err.Error(), http.StatusNotFound)
			return
		}

		//conn will be closed when user socket is closed. this is just in case, so we skip the error
		defer func() {
			_ = conn.Close()
			log.Println("WsHandler defer conn.Close()")
		}()

		userLifeTimeCtx, cancel := context.WithTimeout(context.TODO(), _userLifetime)
		defer cancel()

		services.HandleUser(userLifeTimeCtx, room, conn, services.UserId(userId))
	}
}

func createWSConnection(w http.ResponseWriter, r *http.Request) (*websocket.Conn, error) {
	conn, err := Upgrader.Upgrade(w, r, nil)
	if err != nil {
		return nil, err
	}

	return conn, nil
}
