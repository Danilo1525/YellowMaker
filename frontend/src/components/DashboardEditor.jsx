import React, { useState } from "react";
import {
  Plus,
  LayoutTemplate,
  Save,
  Play,
  FileText,
  Code,
  BarChart2,
} from "lucide-react";
import MarkdownBlock from "./blocks/MarkdownBlock";
import ScriptBlock from "./blocks/ScriptBlock";
import VisualizationBlock from "./blocks/VisualizationBlock";
import api from "../services/api";

export default function DashboardEditor() {
  const [dashboard, setDashboard] = useState({
    name: "Untitled Dashboard",
    description: "",
    blocks: [],
  });

  const addBlock = (type) => {
    const newBlock = {
      id: crypto.randomUUID(),
      type,
      content: type === "markdown" ? "# New Section\nStart writing..." : "",
      code:
        type === "script"
          ? 'import pandas as pd\n\nresult = {"data": [1,2,3]}'
          : "",
      language: type === "script" ? "python" : undefined,
      chartType: type === "visualization" ? "bar" : undefined,
      config: type === "visualization" ? {} : undefined,
      sourceBlock: type === "visualization" ? "" : undefined,
    };
    setDashboard({ ...dashboard, blocks: [...dashboard.blocks, newBlock] });
  };

  const updateBlock = (id, updates) => {
    setDashboard({
      ...dashboard,
      blocks: dashboard.blocks.map((b) =>
        b.id === id ? { ...b, ...updates } : b,
      ),
    });
  };

  const removeBlock = (id) => {
    setDashboard({
      ...dashboard,
      blocks: dashboard.blocks.filter((b) => b.id !== id),
    });
  };

  const [dashboardId, setDashboardId] = useState(null);

  React.useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response = await api.get("/dashboards");
        if (
          response.data &&
          response.data.data &&
          response.data.data.length > 0
        ) {
          const loadedDash = response.data.data[0]; // Load most recent
          setDashboard({
            name: loadedDash.name,
            description: loadedDash.description || "",
            blocks: loadedDash.blocks || [],
          });
          setDashboardId(loadedDash.id);
        }
      } catch (err) {
        console.error("Failed to load dashboard on startup:", err);
      }
    };
    fetchDashboard();
  }, []);

  const handleSave = async () => {
    try {
      const payload = {
        name: dashboard.name || "Untitled",
        description: dashboard.description || "",
        blocks: dashboard.blocks,
      };

      const response = await api.post("/dashboards", payload);
      setDashboardId(response.data.id);

      alert("Dashboard saved successfully!");
    } catch (err) {
      console.error(err);
      alert("Error saving dashboard");
    }
  };

  return (
    <div className="bg-gray-50 p-6 rounded-lg shadow-sm border border-gray-200 min-h-[600px] flex flex-col">
      <div className="flex justify-between items-end mb-6 bg-white p-4 rounded-md shadow-sm border border-gray-100">
        <div className="flex-1 mr-4">
          <input
            type="text"
            value={dashboard.name}
            onChange={(e) =>
              setDashboard({ ...dashboard, name: e.target.value })
            }
            className="text-2xl font-bold text-gray-900 border-none focus:ring-0 p-0 block w-full bg-transparent"
            placeholder="Dashboard Name"
          />
          <input
            type="text"
            value={dashboard.description}
            onChange={(e) =>
              setDashboard({ ...dashboard, description: e.target.value })
            }
            className="text-sm text-gray-500 mt-1 border-none focus:ring-0 p-0 block w-full bg-transparent"
            placeholder="Dashboard Description"
          />
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={handleSave}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
          >
            <Save className="w-4 h-4 mr-2" /> Save Dashboard
          </button>
        </div>
      </div>

      <div className="flex-1 space-y-6">
        {dashboard.blocks.map((block) => (
          <div
            key={block.id}
            className="relative group bg-white rounded-lg shadow-sm border border-gray-200 p-4 transition-shadow hover:shadow-md"
          >
            <button
              onClick={() => removeBlock(block.id)}
              className="absolute top-2 right-2 p-1 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded"
            >
              &times;
            </button>

            {block.type === "markdown" && (
              <MarkdownBlock
                block={block}
                onChange={(updates) => updateBlock(block.id, updates)}
              />
            )}

            {block.type === "script" && (
              <ScriptBlock
                block={block}
                onChange={(updates) => updateBlock(block.id, updates)}
              />
            )}

            {block.type === "visualization" && (
              <VisualizationBlock
                block={block}
                blocks={dashboard.blocks}
                onChange={(updates) => updateBlock(block.id, updates)}
              />
            )}
          </div>
        ))}

        {dashboard.blocks.length === 0 && (
          <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
            <LayoutTemplate className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              No blocks
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Get started by adding a new block.
            </p>
          </div>
        )}
      </div>

      <div className="mt-8 pt-4 border-t border-gray-200 flex justify-center space-x-4">
        <button
          onClick={() => addBlock("markdown")}
          className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
        >
          <FileText className="w-4 h-4 mr-2 text-blue-500" /> Add Text
        </button>
        <button
          onClick={() => addBlock("script")}
          className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
        >
          <Code className="w-4 h-4 mr-2 text-green-500" /> Add Script
        </button>
        <button
          onClick={() => addBlock("visualization")}
          className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
        >
          <BarChart2 className="w-4 h-4 mr-2 text-purple-500" /> Add Chart
        </button>
      </div>
    </div>
  );
}
