package api

import (
	"log/slog"
	"net/http"
	"os"
	"sw-code-interview/api/handlers"
	"time"
)

func NewServer(port string) *http.Server {
	mux := http.NewServeMux()

	//регистрируем WebSocket
	mux.HandleFunc("/ws", logRequest(handlers.WsHandler))

	mux.HandleFunc("/ping", logRequest(func(w http.ResponseWriter, r *http.Request, log *slog.Logger) {
		log.Info("ping")
		w.Write([]byte("pong"))
		return
	}))

	//_, err := os.Stat("index.html")
	//if os.IsNotExist(err) {
	//	fmt.Println("Файл index.html не найден!")
	//}

	return &http.Server{
		Addr:    port,
		Handler: mux,
	}
}

// Глобальный логгер (инициализируется один раз при старте приложения)
var jsonLogger = slog.New(slog.NewJSONHandler(os.Stdout, nil))

func logRequest(next func(w http.ResponseWriter, r *http.Request, logger *slog.Logger)) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		start := time.Now()

		// Создаём логгер с дополнительными полями
		logger := jsonLogger.With(
			"method", r.Method,
			"path", r.URL.Path,
			"ip", r.RemoteAddr,
			"user_agent", r.UserAgent(),
		)

		logger.Info("Request started")

		// Передаём логгер в обработчик
		next(w, r, logger)

		logger.Info("Request completed",
			"duration", time.Since(start),
		)
	}
}
