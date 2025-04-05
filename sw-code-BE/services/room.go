package services

import (
	"context"
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
	Id              string
	Users           map[UserId]User //ключом наверное лучше сделать User.Id
	UsersCountMutex *sync.Mutex
	UsersCount      int
	//UsersCount chan int
	Broadcast  chan WsRequest
	Register   chan User
	Unregister chan User
	Content    string
	ContentMux *sync.Mutex //бездумно прекрыл жёпу, по факту на 1 экземпляр Room крутится 1 рутинка, так что рейса не должно быть
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

func (room *Room) start(ctx context.Context) {
	for {
		select {
		case <-ctx.Done():
			log.Printf("room %s lifetime exeeded\n", room.Id)
			return

		case user := <-room.Register:
			room.Users[user.Id] = user

		case user := <-room.Unregister:
			if _, ok := room.Users[user.Id]; !ok {
				continue
			}

			delete(room.Users, user.Id)
			close(user.IncomingMessages)

		case message := <-room.Broadcast:

			if len(room.Users) == 0 {
				log.Println("попытка бродкаста в пустую комнату")
				return // Выходим, если нет пользователей
			}

			//обновляем контент комнаты для отображения текущего состояния комнаты новым пользователям
			if message.Type == TextMessage {
				room.ContentMux.Lock()
				room.Content = message.Message
				room.ContentMux.Unlock()
			}

			for _, user := range room.Users {
				user.IncomingMessages <- message
			}
		}

		if len(room.Users) == 0 {
			log.Println("комната опустела")
			roomsMutex.Lock()
			delete(rooms, room.Id)
			roomsMutex.Unlock()
			return
		}
	}
}

func (room *Room) registerUser(user User) {
	if !user.IsSubscribed {
		log.Println("попытка зарегать в комнате пользователя без подписки на broadcast")
		return
	}

	room.Register <- user
	room.changeRoomUsersCount(increaseCount)
	room.Broadcast <- NewWsRequest(RoomUsersCount, strconv.Itoa(room.UsersCount))
}

func (room *Room) unregisterUser(user User) {
	if len(room.Users) == 0 {
		return
	}

	room.changeRoomUsersCount(decreaseCount)
	room.Unregister <- user
	room.Broadcast <- NewWsRequest(RoomUsersCount, strconv.Itoa(room.UsersCount))
}

type countChangeType int

var (
	increaseCount = countChangeType(1)
	decreaseCount = countChangeType(-1)
)

func (room *Room) changeRoomUsersCount(value countChangeType) {
	room.UsersCountMutex.Lock()
	room.UsersCount += int(value)
	room.UsersCountMutex.Unlock()
}

func createRoom(ctx context.Context) *Room {
	roomID := uuid.New().String()
	room := Room{
		Id:              roomID,
		Users:           make(map[UserId]User),
		UsersCountMutex: &sync.Mutex{},
		ContentMux:      &sync.Mutex{},
		Broadcast:       make(chan WsRequest),
		Register:        make(chan User),
		Unregister:      make(chan User),
	}

	roomsMutex.Lock()
	rooms[roomID] = &room
	roomsMutex.Unlock()

	go room.start(ctx) // рутина отработает когда комната опустеет (или по котексту)
	return &room
}
