package tables

import (
	"encoding/json"
	"fmt"

	"github.com/user/yellowmaker/orchestrator/internal/database"
)

func CreateTableMetadata(table *TableDefinition) error {
	attributesJSON, err := json.Marshal(table.Attributes)
	if err != nil {
		return fmt.Errorf("failed to marshal attributes: %w", err)
	}

	query := `INSERT INTO table_metadata (table_name, attributes, owner_id) VALUES ($1, $2, $3) RETURNING id, created_at`
	err = database.DB.QueryRow(query, table.TableName, attributesJSON, table.OwnerID).Scan(&table.ID, &table.CreatedAt)
	if err != nil {
		return fmt.Errorf("failed to create table metadata: %w", err)
	}
	return nil
}

func GetTableMetadata(tableName string) (*TableDefinition, error) {
	query := `SELECT id, table_name, attributes, owner_id, created_at FROM table_metadata WHERE table_name = $1`
	row := database.DB.QueryRow(query, tableName)

	var table TableDefinition
	var attributesJSON []byte

	err := row.Scan(&table.ID, &table.TableName, &attributesJSON, &table.OwnerID, &table.CreatedAt)
	if err != nil {
		return nil, err
	}

	if err := json.Unmarshal(attributesJSON, &table.Attributes); err != nil {
		return nil, fmt.Errorf("failed to unmarshal attributes: %w", err)
	}

	return &table, nil
}
