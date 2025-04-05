package handlers

import (
	"context"
	"fmt"
	"github.com/google/uuid"
	"github.com/gorilla/websocket"
	"log"
	"net/http"
	"sw-code-interview/services"
	"time"
)

const (
	_roomLifetime = 2*time.Hour + 30*time.Minute
	_userLifetime = 2 * time.Hour
)

var Upgrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool { return true },
}

// WsHandler назначает room пользователю и открывает websocket соединение в рамках комнаты
func WsHandler() func(http.ResponseWriter, *http.Request) {
	return func(w http.ResponseWriter, r *http.Request) {
		conn, err := createWSConnection(w, r)
		if err != nil {
			log.Println("не удалось открыть wsConnection")
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		}

		roomId := r.URL.Query().Get("roomId")
		userId := uuid.New().String()

		log.Printf("инициирован новый ws, userId: %s, urlRoomId %s", userId, roomId)

		roomCtx, cancelRoom := context.WithTimeout(context.TODO(), _roomLifetime)
		defer cancelRoom()

		room, err := services.GetRoom(roomCtx, roomId)
		if err != nil {
			fmt.Printf("не удалось получить комнату для roomId %s\n", roomId)
			http.Error(w, err.Error(), http.StatusNotFound)
			return
		}

		//конекшн закрывает сам user, тут просто на всякий. если conn уже закрыт, будет ошибка, но нам похеру
		defer func() {
			_ = conn.Close()
			log.Println("WsHandler задеферил conn.Close()")
		}()

		userLifeTimeCtx, cancel := context.WithTimeout(roomCtx, _userLifetime)
		defer cancel()

		services.HandleUser(userLifeTimeCtx, room, conn, services.UserId(userId))
	}
}

func createWSConnection(w http.ResponseWriter, r *http.Request) (*websocket.Conn, error) {
	//поднимаем WebSocket-соединение
	conn, err := Upgrader.Upgrade(w, r, nil)
	if err != nil {
		return nil, fmt.Errorf("ошибка подключения WebSocket: %w", err)
	}

	return conn, nil
}
