import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import { Edit2, Eye } from "lucide-react";

export default function MarkdownBlock({ block, onChange }) {
  const [isEditing, setIsEditing] = useState(true);

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-2 border-b pb-2">
        <span className="text-sm font-semibold text-gray-500 uppercase flex items-center">
          Markdown
        </span>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="text-gray-500 hover:text-gray-700 p-1"
        >
          {isEditing ? (
            <Eye className="w-4 h-4" />
          ) : (
            <Edit2 className="w-4 h-4" />
          )}
        </button>
      </div>

      {isEditing ? (
        <textarea
          value={block.content}
          onChange={(e) => onChange({ content: e.target.value })}
          className="w-full h-32 p-2 border border-gray-300 rounded-md focus:ring-yellow-500 focus:border-yellow-500 font-mono text-sm"
          placeholder="Enter markdown here..."
        />
      ) : (
        <div className="prose max-w-none p-2 min-h-[128px]">
          <ReactMarkdown>{block.content}</ReactMarkdown>
        </div>
      )}
    </div>
  );
}
