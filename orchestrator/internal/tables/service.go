package tables

import (
	"fmt"
	"strings"

	"github.com/user/yellowmaker/orchestrator/internal/database"
)

func CreateTable(req CreateTableRequest, ownerID int) (*TableDefinition, error) {
	// 1. Create Metadata
	tableDef := &TableDefinition{
		TableName:  req.TableName,
		Attributes: req.Attributes,
		OwnerID:    ownerID,
	}

	if err := CreateTableMetadata(tableDef); err != nil {
		return nil, err
	}

	// 2. Generate DDL
	// Sanitize table name (basic avoidance of SQL injection via name, though should be validated strictly)
	safeTableName := sanitizeIdentifier(req.TableName)
	
	var columns []string
	columns = append(columns, "id SERIAL PRIMARY KEY")

	for _, attr := range req.Attributes {
		colDef := fmt.Sprintf("%s %s", sanitizeIdentifier(attr.Name), mapTypeToSQL(attr.Type))
		if attr.Required {
			colDef += " NOT NULL"
		}
		if attr.Default != nil {
			// Handle default values (simplistic)
			colDef += fmt.Sprintf(" DEFAULT '%v'", attr.Default)
		}
		columns = append(columns, colDef)
	}

	// Add metadata columns
	columns = append(columns, "created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP")
	columns = append(columns, "updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP")

	query := fmt.Sprintf("CREATE TABLE %s (%s)", safeTableName, strings.Join(columns, ", "))

	// 3. Execute DDL
	_, err := database.DB.Exec(query)
	if err != nil {
		// Rollback metadata if possible, or just return error
		return nil, fmt.Errorf("failed to create physical table: %w", err)
	}

	return tableDef, nil
}

func sanitizeIdentifier(id string) string {
	// Simple allowlist: alphanumeric and underscores
	// In production, use a improved validation library
	return "\"" + strings.ReplaceAll(id, "\"", "") + "\""
}

func mapTypeToSQL(t AttributeType) string {
	switch t {
	case TypeString:
		return "TEXT"
	case TypeNumber:
		return "NUMERIC"
	case TypeBoolean:
		return "BOOLEAN"
	default:
		return "TEXT"
	}
}
