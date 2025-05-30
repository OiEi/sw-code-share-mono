package services

type MessageType int

const (
	Undefined MessageType = iota
	TextMessage
	RoomCreated
	RoomIdUpdated //not use
	RoomUsersCount
	UserName
)

type WsRequest struct {
	Type    MessageType `json:"type"`
	Message string      `json:"message"`
	//RoomId  string      `json:"roomId"`
}

func NewWsRequest(messageType MessageType, message string) WsRequest {
	return WsRequest{
		Type:    messageType,
		Message: message,
	}
}
