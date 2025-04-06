package main

import (
	"context"
	"fmt"
	"log"
	"net/http"
	"os"
	"os/signal"
	"sw-code-interview/api"
	"syscall"
)

const port = ":8080"

func main() {
	server := api.NewServer(port)

	fmt.Printf("server listen port %s... \n", port)

	err := server.ListenAndServe()
	if err != nil {
		log.Fatal(err)
	}

	waitTerminate(server)
}

func waitTerminate(server *http.Server) {
	sigChan := make(chan os.Signal, 1)
	signal.Notify(sigChan, os.Interrupt, syscall.SIGTERM)
	<-sigChan
	fmt.Println("syscall.SIGTERM signal received, stopping server...")
	err := server.Shutdown(context.Background())
	if err != nil {
		log.Fatal(err)
	}

	fmt.Println("server shutdown successfully")
}
