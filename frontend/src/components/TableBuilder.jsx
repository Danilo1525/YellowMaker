import React, { useState } from "react";
import {
  Table,
  Plus,
  Trash2,
  Save,
  Type,
  Hash,
  ToggleLeft,
} from "lucide-react";
import api from "../services/api";

export default function TableBuilder() {
  const [tableName, setTableName] = useState("");
  const [attributes, setAttributes] = useState([
    { name: "id", type: "number", required: true, primary: true },
  ]);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null);

  const addAttribute = () => {
    setAttributes([
      ...attributes,
      { name: "", type: "string", required: false },
    ]);
  };

  const removeAttribute = (index) => {
    if (attributes[index].primary) return; // Cannot remove primary key
    const newAttrs = [...attributes];
    newAttrs.splice(index, 1);
    setAttributes(newAttrs);
  };

  const updateAttribute = (index, field, value) => {
    const newAttrs = [...attributes];
    newAttrs[index][field] = value;
    setAttributes(newAttrs);
  };

  const handleSave = async () => {
    if (!tableName) return alert("Table name is required");
    if (attributes.some((a) => !a.name))
      return alert("All attributes must have a name");

    setLoading(true);
    setStatus(null);

    try {
      await api.post("/tables", {
        tableName,
        attributes,
      });
      setStatus({
        type: "success",
        message: `Table "${tableName}" created successfully!`,
      });
      setTableName("");
      setAttributes([
        { name: "id", type: "number", required: true, primary: true },
      ]);
    } catch (error) {
      setStatus({
        type: "error",
        message:
          error.response?.data?.message ||
          error.message ||
          "Failed to create table",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-medium text-gray-900 flex items-center">
          <Table className="w-5 h-5 mr-2 text-yellow-600" />
          Smart Table Builder
        </h3>
        <button
          onClick={handleSave}
          disabled={loading}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 disabled:bg-gray-400"
        >
          <Save className="w-4 h-4 mr-2" />
          {loading ? "Saving..." : "Create Table"}
        </button>
      </div>

      {status && (
        <div
          className={`mb-4 p-3 rounded-md text-sm ${status.type === "success" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}
        >
          {status.message}
        </div>
      )}

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Table Name
        </label>
        <input
          type="text"
          value={tableName}
          onChange={(e) =>
            setTableName(
              e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ""),
            )
          }
          placeholder="e.g., users, products"
          className="shadow-sm focus:ring-yellow-500 focus:border-yellow-500 block w-full sm:text-sm border-gray-300 rounded-md py-2 px-3 border"
        />
        <p className="mt-1 text-xs text-gray-500">
          Lowercase letters, numbers, and underscores only.
        </p>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center border-b pb-2">
          <h4 className="text-md font-medium text-gray-700">Attributes</h4>
          <button
            onClick={addAttribute}
            className="inline-flex items-center px-2 py-1 border border-gray-300 text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
          >
            <Plus className="w-3 h-3 mr-1" /> Add Column
          </button>
        </div>

        {attributes.map((attr, index) => (
          <div
            key={index}
            className="flex items-center space-x-3 bg-gray-50 p-3 rounded-md border border-gray-100"
          >
            <div className="flex-1">
              <input
                type="text"
                value={attr.name}
                onChange={(e) =>
                  updateAttribute(
                    index,
                    "name",
                    e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ""),
                  )
                }
                placeholder="Column name"
                disabled={attr.primary}
                className="block w-full sm:text-sm border-gray-300 rounded-md shadow-sm py-1.5 px-3 border disabled:bg-gray-200"
              />
            </div>

            <div className="w-32">
              <div className="relative rounded-md shadow-sm">
                <select
                  value={attr.type}
                  onChange={(e) =>
                    updateAttribute(index, "type", e.target.value)
                  }
                  disabled={attr.primary}
                  className="block w-full pl-3 pr-10 py-1.5 text-base border-gray-300 focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm rounded-md border disabled:bg-gray-200"
                >
                  <option value="string">String</option>
                  <option value="number">Number</option>
                  <option value="boolean">Boolean</option>
                </select>
              </div>
            </div>

            <div className="flex items-center space-x-4 w-32 justify-center">
              <label className="flex items-center space-x-1 cursor-pointer">
                <input
                  type="checkbox"
                  checked={attr.required}
                  onChange={(e) =>
                    updateAttribute(index, "required", e.target.checked)
                  }
                  disabled={attr.primary}
                  className="rounded border-gray-300 text-yellow-600 focus:ring-yellow-500 h-4 w-4"
                />
                <span className="text-xs text-gray-600">Required</span>
              </label>
            </div>

            <div className="w-10 flex justify-end">
              {!attr.primary && (
                <button
                  onClick={() => removeAttribute(index)}
                  className="text-gray-400 hover:text-red-500 focus:outline-none"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
              {attr.primary && (
                <span className="text-xs font-semibold text-yellow-600 bg-yellow-100 px-2 py-0.5 rounded">
                  PK
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
