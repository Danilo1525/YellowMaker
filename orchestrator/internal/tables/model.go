package tables

import "time"

type AttributeType string

const (
	TypeString  AttributeType = "string"
	TypeNumber  AttributeType = "number"
	TypeBoolean AttributeType = "boolean"
)

type Attribute struct {
	Name     string        `json:"name"`
	Type     AttributeType `json:"type"`
	Required bool          `json:"required"`
	Primary  bool          `json:"primary,omitempty"`
	Default  interface{}   `json:"default,omitempty"`
}

type TableDefinition struct {
	ID         int         `json:"id"`
	TableName  string      `json:"tableName"`
	Attributes []Attribute `json:"attributes"`
	CreatedAt  time.Time   `json:"created_at"`
	OwnerID    int         `json:"owner_id"`
}

type CreateTableRequest struct {
	TableName  string      `json:"tableName"`
	Attributes []Attribute `json:"attributes"`
}
