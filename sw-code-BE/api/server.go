package api

import (
	"net/http"
	"sw-code-interview/api/handlers"
)

func NewServer(port string) *http.Server {
	mux := http.NewServeMux()

	//регистрируем WebSocket
	mux.HandleFunc("/ws", handlers.WsHandler())

	mux.HandleFunc("/ping", func(w http.ResponseWriter, r *http.Request) {
		w.Write([]byte("pong, pong"))
		return
	})

	mux.HandleFunc("/task", handlers.TasksHandler())

	return &http.Server{
		Addr:    port,
		Handler: mux,
	}
}
