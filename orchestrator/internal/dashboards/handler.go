package dashboards

import (
	"encoding/json"
	"net/http"

	"github.com/user/yellowmaker/orchestrator/internal/database"
)

type Block struct {
	ID      string `json:"id"`
	Type    string `json:"type"`
	Content string `json:"content,omitempty"`
	Code    string `json:"code,omitempty"`
}

type Dashboard struct {
	ID          int     `json:"id,omitempty"`
	Name        string  `json:"name"`
	Description string  `json:"description"`
	Blocks      []Block `json:"blocks"`
	UserID      int     `json:"user_id"`
}

func SaveDashboardHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Invalid request method", http.StatusMethodNotAllowed)
		return
	}

	var req Dashboard
	err := json.NewDecoder(r.Body).Decode(&req)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	// Assuming UserID is injected by auth middleware.
	// For now, if missing, we default to 1 for prototype purposes.
	if req.UserID == 0 {
		req.UserID = 1
	}

	blocksJSON, err := json.Marshal(req.Blocks)
	if err != nil {
		http.Error(w, "Failed to marshal blocks", http.StatusInternalServerError)
		return
	}

	var newID int
	query := `
		INSERT INTO dashboards (user_id, name, description, blocks) 
		VALUES ($1, $2, $3, $4) 
		RETURNING id`
	
	err = database.DB.QueryRow(query, req.UserID, req.Name, req.Description, string(blocksJSON)).Scan(&newID)
	
	if err != nil {
		http.Error(w, "Failed to save dashboard: "+err.Error(), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(map[string]interface{}{
		"status": "success",
		"id":     newID,
	})
}

func GetDashboardsHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		http.Error(w, "Invalid request method", http.StatusMethodNotAllowed)
		return
	}

	// Assuming a prototype where we just fetch all or filter by a dummy user ID
	userID := 1

	query := `SELECT id, name, description, blocks, user_id FROM dashboards WHERE user_id = $1 ORDER BY created_at DESC`
	rows, err := database.DB.Query(query, userID)
	if err != nil {
		http.Error(w, "Failed to fetch dashboards", http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	var dashboards []Dashboard
	for rows.Next() {
		var dash Dashboard
		var blocksJSON string
		if err := rows.Scan(&dash.ID, &dash.Name, &dash.Description, &blocksJSON, &dash.UserID); err != nil {
			continue // Skip errors for now or log them
		}

		if err := json.Unmarshal([]byte(blocksJSON), &dash.Blocks); err != nil {
			dash.Blocks = []Block{} // Fallback to empty if corrupted
		}
		dashboards = append(dashboards, dash)
	}

	json.NewEncoder(w).Encode(map[string]interface{}{
		"status": "success",
		"data":   dashboards,
	})
}
