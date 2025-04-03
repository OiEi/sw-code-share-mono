package services

type WsRequest struct {
	Type    MessageType `json:"type"`
	Message string      `json:"message"`
	//RoomId  string      `json:"roomId"`
}
