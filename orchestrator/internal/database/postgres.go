package database

import (
	"database/sql"
	"fmt"
	"log"
	"os"
	"time"

	_ "github.com/lib/pq"
)

var DB *sql.DB

func InitDB() {
	var err error
	connStr := fmt.Sprintf(
		"host=%s user=%s password=%s dbname=%s sslmode=disable",
		os.Getenv("DB_HOST"),
		os.Getenv("DB_USER"),
		os.Getenv("DB_PASSWORD"),
		os.Getenv("DB_NAME"),
	)

	// Retry logic for docker-compose startup
	for i := 0; i < 10; i++ {
		DB, err = sql.Open("postgres", connStr)
		if err == nil {
			err = DB.Ping()
			if err == nil {
				fmt.Println("Connected to the database")
				createTables()
				return
			}
		}
		fmt.Printf("Could not connect to database: %v. Retrying in 2s...\n", err)
		time.Sleep(2 * time.Second)
	}

	log.Fatal("Could not connect to database after retries")
}

func createTables() {
	query := `
	CREATE TABLE IF NOT EXISTS users (
		id SERIAL PRIMARY KEY,
		username TEXT UNIQUE NOT NULL,
		password TEXT NOT NULL,
		role TEXT NOT NULL DEFAULT 'user',
		created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
	);

	CREATE TABLE IF NOT EXISTS table_metadata (
		id SERIAL PRIMARY KEY,
		table_name TEXT UNIQUE NOT NULL,
		attributes JSONB NOT NULL,
		owner_id INT NOT NULL,
		created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
		FOREIGN KEY (owner_id) REFERENCES users(id)
	);

	CREATE TABLE IF NOT EXISTS dashboards (
		id SERIAL PRIMARY KEY,
		user_id INT NOT NULL,
		name TEXT NOT NULL,
		description TEXT,
		blocks JSONB NOT NULL,
		created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
		FOREIGN KEY (user_id) REFERENCES users(id)
	);
	`
	_, err := DB.Exec(query)
	if err != nil {
		log.Fatalf("Failed to create tables: %v", err)
	}
}
