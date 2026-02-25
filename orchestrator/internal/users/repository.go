package users

import (
	"database/sql"
	"fmt"

	"github.com/user/yellowmaker/orchestrator/internal/database"
)

func CreateUser(user *User) error {
	query := `INSERT INTO users (username, password, role) VALUES ($1, $2, $3) RETURNING id, created_at`
	err := database.DB.QueryRow(query, user.Username, user.Password, user.Role).Scan(&user.ID, &user.CreatedAt)
	if err != nil {
		return fmt.Errorf("failed to create user: %w", err)
	}
	return nil
}

func GetUserByUsername(username string) (*User, error) {
	query := `SELECT id, username, password, role, created_at FROM users WHERE username = $1`
	row := database.DB.QueryRow(query, username)

	var user User
	err := row.Scan(&user.ID, &user.Username, &user.Password, &user.Role, &user.CreatedAt)
	if err != nil {
		if err == sql.ErrNoRows {
			return nil, nil
		}
		return nil, fmt.Errorf("failed to get user: %w", err)
	}
	return &user, nil
}
