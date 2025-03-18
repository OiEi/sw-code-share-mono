package main

import (
	"context"
	"fmt"
	"log"
	"net/http"
	"os"
	"os/signal"
	"sw-code-interview/api/handlers"
	"syscall"
)

const port = ":8080"

func main() {
	mux := http.NewServeMux()

	//скрипт в index.html дергает этот роут
	mux.HandleFunc("/ws", handlers.WsHandler()) //регистрируем WebSocket

	_, err := os.Stat("index.html")
	if os.IsNotExist(err) {
		fmt.Println("Файл index.html не найден!")
	}

	// mux.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
	// 	http.ServeFile(w, r, "index.html") // отправляем клиенту HTML файл
	// })

	
	mux.HandleFunc("/ping", func(w http.ResponseWriter, r *http.Request) {
		w.Write([]byte("pong")) // отправляем клиенту HTML файл
		return
	})

	server := http.Server{
		Addr:    port,
		Handler: mux,
	}

	fmt.Printf("сервер слушает на порту %s... \n", port)

	err = server.ListenAndServe()
	if err != nil {
		log.Fatal(err)
	}

	waitTerminate(&server)
}

func waitTerminate(server *http.Server) {
	sigChan := make(chan os.Signal, 1)
	signal.Notify(sigChan, os.Interrupt, syscall.SIGTERM)
	<-sigChan
	fmt.Println("получен syscall.SIGTERM, завершаем работу сервера...")
	server.Shutdown(context.Background())
	fmt.Println("сервер остановлен")
}
