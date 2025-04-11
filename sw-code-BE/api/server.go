package api

import (
	"net/http"
	"sw-code-interview/api/handlers"
)

func roomAuthorize(next http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		roomId := r.URL.Query().Get("roomId")
		if len(roomId) == 0 {
			w.WriteHeader(http.StatusForbidden)
			return
		}

		next(w, r)
	}
}

func NewServer(port string) *http.Server {
	mux := http.NewServeMux()

	//регистрируем WebSocket
	mux.HandleFunc("/ws", roomAuthorize(handlers.WsHandler()))
	mux.HandleFunc("/auth/ws", handlers.WsAuthHandler())

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
