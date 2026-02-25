package files

import (
	"fmt"
	"io"
	"net/http"
	"os"
	"path/filepath"

	"github.com/user/yellowmaker/orchestrator/internal/kafka"
)

func UploadHandler(w http.ResponseWriter, r *http.Request) {
	// 10MB limit
	r.ParseMultipartForm(10 << 20)

	file, handler, err := r.FormFile("file")
	if err != nil {
		http.Error(w, "Error retrieving the file", http.StatusBadRequest)
		return
	}
	defer file.Close()

	// Ensure uploads directory exists
	uploadDir := "/uploads"
	if _, err := os.Stat(uploadDir); os.IsNotExist(err) {
		// Fallback for local testing if not in docker
		uploadDir = "./uploads"
		os.MkdirAll(uploadDir, os.ModePerm)
	}

	// Save file
	filePath := filepath.Join(uploadDir, handler.Filename)
	dst, err := os.Create(filePath)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	defer dst.Close()

	if _, err := io.Copy(dst, file); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	// Publish event
	err = kafka.ProduceEvent("file-upload", handler.Filename, []byte(fmt.Sprintf(`{"filepath": "%s", "filename": "%s"}`, filePath, handler.Filename)))
	if err != nil {
		fmt.Printf("Failed to produce event: %v\n", err)
		// Don't fail the request, but log it. 
	}

	w.WriteHeader(http.StatusOK)
	w.Write([]byte(fmt.Sprintf("File uploaded successfully: %s", handler.Filename)))
}
