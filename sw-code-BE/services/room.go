package services

import (
	"fmt"
	"github.com/google/uuid"
	"log"
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
	Broadcast  chan string
	Register   chan User
	Unregister chan User
	Content    string
	ContentMux sync.RWMutex //бездумно прекрыл жёпу, по факту на 1 экземпляр Room крутится 1 рутинка, так что рейса не должно быть
}

func GetRoom(roomId string) (*Room, error) {
	if len(roomId) == 0 {
		log.Println("roomId is empty, create a new room")
		return createRoom(), nil
	}

	roomsMutex.Lock()
	room, ok := rooms[roomId]
	roomsMutex.Unlock()

	if !ok {
		return nil, fmt.Errorf("комната с Id %s не найдена", roomId)
	}

	return room, nil
}

func createRoom() *Room {
	roomID := uuid.New().String()
	room := Room{
		Id:         roomID,
		Users:      make(map[User]struct{}),
		Broadcast:  make(chan string),
		Register:   make(chan User),
		Unregister: make(chan User),
	}

	roomsMutex.Lock()
	rooms[roomID] = &room
	roomsMutex.Unlock()

	go room.start() // рутина отработает когда комната опустеет
	return &room
}

func (room *Room) start() {
	for {
		select {
		case user := <-room.Register:
			room.Users[user] = struct{}{}
		case user := <-room.Unregister:
			if _, ok := room.Users[user]; ok {
				delete(room.Users, user)
				close(user.Send)
			}
		case message := <-room.Broadcast:
			//обновляем контент комнаты для отображения текущего состояния комнаты новым пользователям
			room.ContentMux.Lock()
			room.Content = message
			room.ContentMux.Unlock()

			for user := range room.Users {
				user.Send <- message
			}
		}

		if len(room.Users) == 0 {
			return
		}
	}
}
