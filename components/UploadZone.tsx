"use client";

import { ChangeEvent } from "react";

interface UploadZoneProps {
  title: string;
  file: File | null;
  onFileChange: (file: File | null) => void;
}

export default function UploadZone({
  title,
  file,
  onFileChange,
}: UploadZoneProps) {
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0] ?? null;

    onFileChange(selectedFile);
  };

  return (
    <div className="rounded-xl border-2 border-dashed border-gray-300 bg-white p-8 text-center transition hover:border-blue-500">
      <div className="mb-4 text-4xl">📄</div>

      <h2 className="mb-2 text-lg font-semibold text-gray-900">
        {title}
      </h2>

      <p className="mb-5 text-sm text-gray-500">
        Upload a PDF document
      </p>

      <label className="inline-block cursor-pointer rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700">
        Choose File

        <input
          type="file"
          accept=".pdf,image/*"
          className="hidden"
          onChange={handleChange}
        />
      </label>

      {file && (
        <div className="mt-5 rounded-lg bg-gray-50 p-3 text-sm text-gray-700">
          <p className="font-medium">{file.name}</p>

          <p className="mt-1 text-xs text-gray-500">
            {(file.size / 1024 / 1024).toFixed(2)} MB
          </p>
        </div>
      )}
    </div>
  );
}