package services

import (
	"context"
	"fmt"
	"github.com/google/uuid"
	"log"
	"strconv"
	"sync"
)

// это можно хранить в БД
var (
	rooms      = make(map[string]*Room)
	roomsMutex sync.Mutex
)

// Room запускает рутину-воркер которая регает/удаляет пользователей, бродкастит сообщения между пользователями
type Room struct {
	Id         string
	Users      map[User]struct{} //ключом наверное лучше сделать User.Id
	Broadcast  chan WsRequest
	Register   chan User
	Unregister chan User
	Content    string
	ContentMux sync.RWMutex //бездумно прекрыл жёпу, по факту на 1 экземпляр Room крутится 1 рутинка, так что рейса не должно быть
}

func GetRoom(ctx context.Context, roomId string) (*Room, error) {
	if len(roomId) == 0 {
		log.Println("roomId is empty, create a new room")
		return createRoom(ctx), nil
	}

	roomsMutex.Lock()
	room, ok := rooms[roomId]
	roomsMutex.Unlock()

	if !ok {
		log.Printf("комната с Id %s не найдена, создаем новую", roomId)
		return createRoom(ctx), nil
	}

	return room, nil
}

func (room *Room) updateUsersCount() {
	room.Broadcast <- NewWsRequest(RoomUsersCount, strconv.Itoa(len(room.Users)))
}

func (room *Room) start(ctx context.Context) {
	for {
		select {
		case <-ctx.Done():
			fmt.Printf("room %s lifetime exeeded", room.Id)
			return

		case user := <-room.Register:
			room.Users[user] = struct{}{}

		case user := <-room.Unregister:
			if _, ok := room.Users[user]; !ok {
				continue
			}

			delete(room.Users, user)
			close(user.IncomingMessages)

		case message := <-room.Broadcast:
			//обновляем контент комнаты для отображения текущего состояния комнаты новым пользователям
			if message.Type == TextMessage {
				room.ContentMux.Lock()
				room.Content = message.Message
				room.ContentMux.Unlock()
			}

			for user := range room.Users {
				user.IncomingMessages <- message
			}
		}

		if len(room.Users) == 0 {
			return
		}
	}
}

func createRoom(ctx context.Context) *Room {
	roomID := uuid.New().String()
	room := Room{
		Id:         roomID,
		Users:      make(map[User]struct{}),
		Broadcast:  make(chan WsRequest),
		Register:   make(chan User),
		Unregister: make(chan User),
	}

	roomsMutex.Lock()
	rooms[roomID] = &room
	roomsMutex.Unlock()

	go room.start(ctx) // рутина отработает когда комната опустеет (или по котексту)
	return &room
}
