import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";
import { BarChart2 } from "lucide-react";

export default function VisualizationBlock({ block, blocks, onChange }) {
  // Find the selected source script block
  const sourceBlock = blocks.find((b) => b.id === block.sourceBlock);

  // Mock data for demonstration since true script execution isn't connected to state here
  const mockData = [
    { name: "Jan", value: 400 },
    { name: "Feb", value: 300 },
    { name: "Mar", value: 200 },
    { name: "Apr", value: 278 },
    { name: "May", value: 189 },
  ];

  const data = mockData; // In real app, this would come from the sourceBlock's cached result

  const renderChart = () => {
    if (!data || data.length === 0)
      return (
        <div className="text-gray-400 text-center py-10">
          No data to display
        </div>
      );

    switch (block.chartType) {
      case "line":
        return (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="value" stroke="#ca8a04" />
            </LineChart>
          </ResponsiveContainer>
        );
      case "bar":
      default:
        return (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="#d97706" />
            </BarChart>
          </ResponsiveContainer>
        );
    }
  };

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-4 border-b pb-2">
        <span className="text-sm font-semibold text-gray-500 uppercase flex items-center">
          <BarChart2 className="w-4 h-4 mr-1" /> Visualization
        </span>

        <div className="flex space-x-2">
          <select
            value={block.sourceBlock || ""}
            onChange={(e) => onChange({ sourceBlock: e.target.value })}
            className="text-xs border-gray-300 rounded focus:ring-yellow-500 focus:border-yellow-500"
          >
            <option value="">Select Data Source...</option>
            {blocks
              .filter((b) => b.type === "script")
              .map((b) => (
                <option key={b.id} value={b.id}>
                  Script block: {b.id.substring(0, 8)}
                </option>
              ))}
          </select>

          <select
            value={block.chartType || "bar"}
            onChange={(e) => onChange({ chartType: e.target.value })}
            className="text-xs border-gray-300 rounded focus:ring-yellow-500 focus:border-yellow-500"
          >
            <option value="bar">Bar Chart</option>
            <option value="line">Line Chart</option>
          </select>
        </div>
      </div>

      <div className="bg-white p-4">{renderChart()}</div>
    </div>
  );
}
