import React, { useState, useRef } from "react";
import { Upload, File, CheckCircle, AlertCircle } from "lucide-react";
import api from "../services/api";

export default function FileUpload() {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [status, setStatus] = useState(null); // 'idle', 'success', 'error'
  const [message, setMessage] = useState("");
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setStatus("idle");
      setMessage("");
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);
    setStatus("idle");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await api.post("/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setStatus("success");
      setMessage(response.data || "File uploaded successfully");
      setFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      setStatus("error");
      setMessage(error.response?.data || "Failed to upload file");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
        <Upload className="w-5 h-5 mr-2 text-yellow-600" />
        Data Upload
      </h3>

      <div className="mt-2 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md relative hover:border-yellow-500 transition-colors">
        <div className="space-y-1 text-center">
          <File className="mx-auto h-12 w-12 text-gray-400" />
          <div className="flex text-sm text-gray-600 justify-center">
            <label
              htmlFor="file-upload"
              className="relative cursor-pointer bg-white rounded-md font-medium text-yellow-600 hover:text-yellow-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-yellow-500"
            >
              <span>Upload a file</span>
              <input
                id="file-upload"
                name="file-upload"
                type="file"
                className="sr-only"
                onChange={handleFileChange}
                ref={fileInputRef}
                accept=".csv,.xlsx,.xls,.odt,.sql"
              />
            </label>
            <p className="pl-1">or drag and drop</p>
          </div>
          <p className="text-xs text-gray-500">
            CSV, XLSX, ODT, SQL up to 10MB
          </p>
        </div>
      </div>

      {file && (
        <div className="mt-4 flex items-center justify-between p-3 bg-gray-50 rounded-md">
          <div className="flex items-center truncate">
            <File className="h-5 w-5 text-gray-400 mr-2 flex-shrink-0" />
            <span className="text-sm text-gray-700 truncate">{file.name}</span>
          </div>
          <button
            onClick={handleUpload}
            disabled={uploading}
            className={`ml-4 px-4 py-2 text-sm font-medium text-white rounded-md shadow-sm transition-colors ${uploading ? "bg-yellow-400 cursor-not-allowed" : "bg-yellow-600 hover:bg-yellow-700"}`}
          >
            {uploading ? "Uploading..." : "Upload"}
          </button>
        </div>
      )}

      {status === "success" && (
        <div className="mt-4 flex items-center text-sm text-green-600 bg-green-50 p-3 rounded-md">
          <CheckCircle className="h-4 w-4 mr-2" />
          {message}
        </div>
      )}

      {status === "error" && (
        <div className="mt-4 flex items-center text-sm text-red-600 bg-red-50 p-3 rounded-md">
          <AlertCircle className="h-4 w-4 mr-2" />
          {message}
        </div>
      )}
    </div>
  );
}
