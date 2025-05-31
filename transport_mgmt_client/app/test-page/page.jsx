"use client";

import React, { useState } from "react";
import {
  Card,
  CardAction,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileCheck2, Loader2 } from "lucide-react";

const TestPage = () => {
  const [fileName, setFileName] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [response, setResponse] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) setFileName(file.name);
  };

  const handleUpload = async () => {
    const input = document.getElementById("csvInput");
    const file = input?.files?.[0];
    if (!file) return;

    setUploading(true);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch(
        "http://localhost:8000/api/ingestion/upload-students/",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await res.json();
      setResponse(data);
    } catch (err) {
      console.error("Upload error:", err);
      setResponse({ error: "Upload failed. Please try again." });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-10">
      <Card>
        <CardHeader className="flex justify-center">
          <CardAction>
            <input
              id="csvInput"
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              className="cursor-pointer rounded border border-gray-300
                         bg-white py-2 px-3 text-sm text-gray-700
                         file:mr-4 file:py-2 file:px-4
                         file:rounded file:border-0
                         file:bg-blue-50 file:text-blue-700
                         hover:file:bg-blue-100
                         focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </CardAction>
        </CardHeader>

        <CardContent className="flex flex-col items-center space-y-4">
          {fileName && (
            <div className="flex items-center gap-2 text-green-700 text-sm font-medium">
              <FileCheck2 className="w-5 h-5" />
              <span>{fileName}</span>
            </div>
          )}
          {response && (
            <div
              className={`max-h-48 overflow-auto rounded border
                p-3 text-xs font-mono whitespace-pre-wrap
                ${
                  response.error
                    ? "border-red-400 bg-red-50 text-red-700"
                    : "border-gray-300 bg-gray-50 text-gray-700"
                }`}
              style={{ width: "100%" }}
            >
              <pre>{JSON.stringify(response, null, 2)}</pre>
            </div>
          )}
        </CardContent>

        <CardFooter className="flex justify-center">
          <Button
            onClick={handleUpload}
            disabled={uploading || !fileName}
            className="w-64 flex items-center justify-center gap-2"
          >
            {uploading && (
              <Loader2 className="w-5 h-5 animate-spin text-white" />
            )}
            {uploading ? "Uploading..." : "Upload"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default TestPage;
