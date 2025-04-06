package services

import (
	"context"
	"github.com/google/uuid"
	"log"
	"strconv"
	"sync"
	"sync/atomic"
	"time"
)

const _roomLifetime = 2*time.Hour + 30*time.Minute

type countChangeType int

var (
	increaseCount = countChangeType(1)
	decreaseCount = countChangeType(-1)
)

// это можно хранить в БД
var (
	rooms      = make(map[string]*Room)
	roomsMutex sync.Mutex
)

// Room запускает рутину-воркер которая регает/удаляет пользователей, бродкастит сообщения между пользователями
type Room struct {
	Id         string
	Users      map[UserId]User //ключом наверное лучше сделать User.Id
	UsersCount *atomic.Int32
	//UsersCount chan int
	Broadcast  chan WsRequest
	Register   chan User
	Unregister chan User
	Content    string
	ContentMux *sync.Mutex //бездумно прекрыл жёпу, по факту на 1 экземпляр Room крутится 1 рутинка, так что рейса не должно быть
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
		log.Printf("комната с Id %s не найдена, создаем новую", roomId)
		return createRoom(), nil
	}

	return room, nil
}

func (room *Room) start() {
	ctx, cancelRoom := context.WithTimeout(context.TODO(), _roomLifetime)
	defer cancelRoom()

	for {
		select {
		case <-ctx.Done():
			log.Printf("room %s ctx.Done\n", room.Id)
			return

		case user := <-room.Register:
			room.Users[user.Id] = user

		case user := <-room.Unregister:
			if _, ok := room.Users[user.Id]; !ok {
				continue
			}

			delete(room.Users, user.Id)

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
				if !user.IsSocketOpen.Load() {
					continue
				}

				user.IncomingMessages <- message
			}
		}

		if len(room.Users) == 0 {
			log.Printf("room was empty, delete room %s\n", room.Id)
			roomsMutex.Lock()
			delete(rooms, room.Id)
			roomsMutex.Unlock()
			return
		}
	}
}

func (room *Room) registerUser(user User) {
	if !user.IsSocketOpen.Load() {
		log.Println("attempt to register user without subscription to broadcast")
		return
	}

	room.Register <- user
	room.changeRoomUsersCount(increaseCount)
	room.Broadcast <- NewWsRequest(RoomUsersCount, strconv.Itoa(int(room.UsersCount.Load())))
}

func (room *Room) unregisterUser(user User) {
	if len(room.Users) == 0 {
		log.Println("attempt to unregister user from empty room")
		return
	}

	room.Unregister <- user
	room.changeRoomUsersCount(decreaseCount)
	room.Broadcast <- NewWsRequest(RoomUsersCount, strconv.Itoa(int(room.UsersCount.Load())))
}

func (room *Room) changeRoomUsersCount(value countChangeType) {
	room.UsersCount.Add(int32(value))
}

func createRoom() *Room {
	roomID := uuid.New().String()
	room := Room{
		Id:         roomID,
		Users:      make(map[UserId]User),
		UsersCount: &atomic.Int32{},
		ContentMux: &sync.Mutex{},
		Broadcast:  make(chan WsRequest),
		Register:   make(chan User),
		Unregister: make(chan User),
	}

	roomsMutex.Lock()
	rooms[roomID] = &room
	roomsMutex.Unlock()

	go room.start() // рутина отработает когда комната опустеет (или по котексту)
	return &room
}
