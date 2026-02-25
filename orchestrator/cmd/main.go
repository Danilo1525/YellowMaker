package main

import (
	"fmt"
	"log"
	"net/http"

	"github.com/rs/cors"
	"github.com/user/yellowmaker/orchestrator/internal/auth"
	"github.com/user/yellowmaker/orchestrator/internal/dashboards"
	"github.com/user/yellowmaker/orchestrator/internal/database"
	"github.com/user/yellowmaker/orchestrator/internal/files"
	"github.com/user/yellowmaker/orchestrator/internal/tables"
)

func main() {
	fmt.Println("Starting Orchestrator Service on port 8080...")

	database.InitDB()

	mux := http.NewServeMux()

	mux.HandleFunc("/health", func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusOK)
		w.Write([]byte("OK"))
	})

	mux.HandleFunc("/api/auth/register", auth.RegisterHandler)
	mux.HandleFunc("/api/auth/login", auth.LoginHandler)

	// Protected route example
	mux.Handle("/api/protected", auth.AuthMiddleware(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Write([]byte("You are authenticated"))
	})))

	// Table routes
	mux.Handle("/api/tables", auth.AuthMiddleware(http.HandlerFunc(tables.CreateTableHandler)))

	// File routes
	mux.HandleFunc("/api/upload", files.UploadHandler)

	// Dashboard routes
	mux.Handle("/api/dashboards", auth.AuthMiddleware(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if r.Method == http.MethodGet {
			dashboards.GetDashboardsHandler(w, r)
		} else if r.Method == http.MethodPost {
			dashboards.SaveDashboardHandler(w, r)
		} else {
			http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		}
	})))

	c := cors.New(cors.Options{
		AllowedOrigins:   []string{"*"},
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowedHeaders:   []string{"*"},
		AllowCredentials: true,
	})

	handler := c.Handler(mux)

	log.Fatal(http.ListenAndServe(":8080", handler))
}
