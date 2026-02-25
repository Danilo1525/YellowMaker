package tables

import (
	"encoding/json"
	"net/http"

	"github.com/user/yellowmaker/orchestrator/internal/auth"
)

func CreateTableHandler(w http.ResponseWriter, r *http.Request) {
	userID := r.Context().Value(auth.UserIDKey).(int)

	var req CreateTableRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	tableDef, err := CreateTable(req, userID)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(tableDef)
}

func ListTablesHandler(w http.ResponseWriter, r *http.Request) {
	// Implementation for listing tables
	w.WriteHeader(http.StatusNotImplemented)
}

func GetTableHandler(w http.ResponseWriter, r *http.Request) {
    // Implementation for getting table details
    w.WriteHeader(http.StatusNotImplemented)
}
