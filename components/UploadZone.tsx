"use client";

import { ChangeEvent } from "react";
import { FileUp, X } from "lucide-react";

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

    if (selectedFile && selectedFile.type !== "application/pdf" && !selectedFile.type.startsWith("image/")) {
      event.target.value = "";
      onFileChange(null);
      return;
    }

    onFileChange(selectedFile);
  };

  return (
    <div className="relative flex min-h-37.5 items-center justify-center rounded-2xl border border-dashed border-[#d0cecc] bg-white p-5 text-center transition hover:border-[#ff6841] sm:min-h-38.75">
      <label className="flex w-full cursor-pointer flex-col items-center justify-center gap-2">
        {file ? <div className="relative flex max-w-full items-center gap-3 rounded-lg bg-[#f5f5f4] px-3 py-2 text-left"><span className={`grid h-8 w-8 shrink-0 place-items-center rounded text-[9px] font-bold text-white ${file.type === "application/pdf" ? "bg-[#ef5550]" : "bg-[#6b8cff]"}`}>{file.type === "application/pdf" ? "PDF" : "IMG"}</span><span className="min-w-0"><span className="block max-w-45 truncate text-xs font-semibold text-[#363534]">{file.name}</span><span className="mt-1 block text-[10px] text-[#999694]">{(file.size / 1024 / 1024).toFixed(1)}MB &nbsp;•&nbsp; {file.type === "application/pdf" ? "PDF" : "Image"}</span></span><button type="button" onClick={(event) => { event.preventDefault(); onFileChange(null); }} className="absolute -right-2 -top-2 grid h-5 w-5 place-items-center rounded-full bg-[#555453] text-white"><X className="h-3 w-3" /></button></div> : <><span className="grid h-10 w-10 place-items-center rounded-lg bg-[#f2f2f1] text-[#3f3e3d]"><FileUp className="h-5 w-5" /></span><span className="text-sm font-semibold text-[#3a3938]">Upload <span className="text-[#ff5a32]">{title}</span></span><span className="text-[10px] text-[#aaa7a5]">PDF or image · Max 10MB</span></>}

        <input
          type="file"
          accept="application/pdf,image/*"
          className="hidden"
          onChange={handleChange}
        />
      </label>
    </div>
  );
}