import React, { useState } from "react";
import {
  Play,
  Code,
  CheckCircle,
  AlertCircle,
  BarChart2,
  FileJson,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export default function ScriptBlock({ block, onChange }) {
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState("chart"); // 'data' or 'chart'

  const handleRun = async () => {
    setRunning(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch(
        "http://localhost:8000/api/scripts/execute",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ code: block.code }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Execution failed on server");
      }

      setResult(data);
    } catch (err) {
      setError(err.message || "Execution failed");
    } finally {
      setRunning(false);
    }
  };

  // Helper to detect chartable data
  const getChartConfig = (data) => {
    if (!Array.isArray(data) || data.length === 0) return null;

    const sample = data[0];
    if (typeof sample !== "object" || sample === null) return null;

    const keys = Object.keys(sample);
    let xKey = null;
    let yKeys = [];

    // Simple heuristic: first string/non-numeric is X, others numeric are Y
    keys.forEach((k) => {
      if (typeof sample[k] === "number") {
        yKeys.push(k);
      } else if (!xKey) {
        xKey = k;
      }
    });

    if (!xKey && yKeys.length > 0) {
      xKey = yKeys.shift();
    } // Fallback

    return { xKey, yKeys };
  };

  const chartConfig =
    result && result.data ? getChartConfig(result.data) : null;
  const colors = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-2 border-b pb-2">
        <span className="text-sm font-semibold text-gray-500 uppercase flex items-center">
          <Code className="w-4 h-4 mr-1" /> Python Script
        </span>
        <button
          onClick={handleRun}
          disabled={running}
          className="inline-flex items-center px-2 py-1 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-green-600 hover:bg-green-700 disabled:bg-green-400"
        >
          <Play className="w-3 h-3 mr-1" /> {running ? "Running..." : "Run"}
        </button>
      </div>

      <div className="space-y-4">
        <textarea
          value={block.code}
          onChange={(e) => onChange({ code: e.target.value })}
          className="w-full h-40 p-3 bg-gray-900 text-gray-100 font-mono text-sm rounded-md focus:ring-yellow-500 focus:border-yellow-500"
          spellCheck="false"
        />

        {error && (
          <div className="p-3 bg-red-50 text-red-700 rounded-md text-sm font-mono flex items-start">
            <AlertCircle className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
            <pre className="whitespace-pre-wrap">{error}</pre>
          </div>
        )}

        {result && (
          <div className="border border-gray-200 rounded-md overflow-hidden">
            <div className="bg-gray-50 p-2 flex items-center justify-between border-b">
              <div className="flex items-center text-green-600 text-sm font-medium">
                <CheckCircle className="w-4 h-4 mr-1" /> Success
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => setViewMode("data")}
                  className={`p-1.5 rounded-md flex items-center text-xs font-medium ${viewMode === "data" ? "bg-white shadow text-gray-800" : "text-gray-500 hover:text-gray-700"}`}
                >
                  <FileJson className="w-3.5 h-3.5 mr-1" /> JSON
                </button>
                <button
                  onClick={() => setViewMode("chart")}
                  className={`p-1.5 rounded-md flex items-center text-xs font-medium ${viewMode === "chart" ? "bg-white shadow text-gray-800" : "text-gray-500 hover:text-gray-700"}`}
                >
                  <BarChart2 className="w-3.5 h-3.5 mr-1" /> Chart
                </button>
              </div>
            </div>

            <div className="bg-white p-4">
              {viewMode === "data" || !chartConfig ? (
                <pre className="text-sm font-mono overflow-auto max-h-60 bg-gray-50 p-3 rounded">
                  {JSON.stringify(result, null, 2)}
                </pre>
              ) : (
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={result.data}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis
                        dataKey={chartConfig.xKey}
                        tick={{ fontSize: 12 }}
                      />
                      <YAxis tick={{ fontSize: 12 }} />
                      <Tooltip
                        contentStyle={{
                          borderRadius: "8px",
                          border: "none",
                          boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                        }}
                      />
                      <Legend wrapperStyle={{ paddingTop: "20px" }} />
                      {chartConfig.yKeys.map((key, i) => (
                        <Bar
                          key={key}
                          dataKey={key}
                          fill={colors[i % colors.length]}
                          radius={[4, 4, 0, 0]}
                          maxBarSize={60}
                        />
                      ))}
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
