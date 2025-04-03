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
		roomId := r.URL.Query().Get("roomId")

		//TODO выпили когда нибудь когда он умрет
		if roomId == "b4655d58-21ae-4e6e-aee0-ab830142a654" {
			log.Println("этот пидр до сих пор не выключил комп")
		}

		clientId := uuid.New().String()

		log.Printf("инициирован новый ws, clientId: %s, urlRoomId %s", clientId, roomId)

		roomCtx, cancelRoom := context.WithTimeout(context.TODO(), _roomLifetime)
		defer cancelRoom()

		room, isNewRoom, err := services.GetRoom(roomCtx, roomId)
		if err != nil {
			fmt.Printf("не удалось получить комнату для roomId %s\n", roomId)
			http.Error(w, err.Error(), http.StatusNotFound)
			return
		}

		conn, err := createWSConnection(w, r)
		if err != nil {
			fmt.Println("не удалось открыть wsConnection")
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		}

		defer func() {
			err = conn.Close()
			if err != nil {
				fmt.Println("не удалось закрыть websocket")
			}
			fmt.Printf("websocket соединение клиента %s закрыто\n", clientId)
		}()

		userLifeTimeCtx, cancel := context.WithTimeout(roomCtx, _userLifetime)
		defer cancel()

		services.HandleUser(userLifeTimeCtx, room, conn, clientId, isNewRoom)
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
