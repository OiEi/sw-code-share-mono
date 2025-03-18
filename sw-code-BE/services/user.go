package services

import (
	"fmt"
	"github.com/gorilla/websocket"
	"log"
)

type User struct {
	Id     string
	RoomID string //в текущей реализации не нужно)
	Socket *websocket.Conn
	Send   chan string // канал для отправки сообщений, можно сделать буферизированным, но в текущих реалиях нафих не надо
}

func HandleUser(room *Room, conn *websocket.Conn, clientID string) {
	client := User{
		Id:     clientID,
		RoomID: room.Id,
		Socket: conn,
		Send:   make(chan string),
	}

	room.Register <- client

	//Делегируем закрытие conn и client.Send клиента room
	//можно еще подстраховаться и тут conn закрыть
	defer func() {
		room.Unregister <- client
	}()

	// Уведомляем пользователя о создании комнаты для формирования ссылки
	// В текущей реализации index.html ссылку для шаринга показываем только тому кто создал комнату
	response := struct {
		Type   string //пока не нужно
		RoomId string `json:"roomId"`
	}{
		Type:   "room-created",
		RoomId: room.Id,
	}

	if err := conn.WriteJSON(response); err != nil {
		log.Println("не удалось отправить room-created message:", err)
		return
	}

	//Подписка на broadcast что-бы получать сообщения от других клиентов
	go func() {
		//room закроет client.Send по room.Unregister <- client
		for msg := range client.Send {
			if len(msg) == 0 {
				continue
			}

			err := conn.WriteMessage(websocket.TextMessage, []byte(msg))
			if err != nil {
				fmt.Println("не удалось отправить сообщение: %s, клиенту %s: , - %s\n", msg, client.Id, err.Error())
			}
		}
	}()

	//Пушим новому клиенту состояние room на момент подключения
	client.Send <- room.Content

	//Читаем входящие сообщения от клиента и пушим их в broadcast для всех клиентов комнаты
	for {
		_, msg, err := conn.ReadMessage()
		if websocket.IsCloseError(err, websocket.CloseNormalClosure, websocket.CloseGoingAway) {
			fmt.Printf("клиент %s закрыл соединение: %s\n", clientID, err)
			return
		}

		if err != nil {
			fmt.Printf("ошибка чтения от клиента %s: - %s\n", clientID, err)
			return
		}

		fmt.Printf("получено сообщение для комнаты %s от клиента %s: - %s\n", room.Id, clientID, string(msg))

		room.Broadcast <- string(msg)
	}
}
