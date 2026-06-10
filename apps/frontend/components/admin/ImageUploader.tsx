"use client";

import { useRef, useState } from "react";

interface Props {
  value: string;
  onChange: (url: string) => void;
}

export default function ImageUploader({ value, onChange }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");

  async function handleFile(file: File) {
    setError("");
    setInfo("");
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "上傳失敗");
      onChange(data.url);
      const img = new Image();
      img.onload = () => setInfo(`${file.name} · ${(file.size / 1024).toFixed(0)}KB · ${img.naturalWidth}×${img.naturalHeight}`);
      img.src = data.url;
    } catch (err) {
      setError(err instanceof Error ? err.message : "上傳失敗");
    } finally {
      setUploading(false);
    }
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }

  return (
    <div>
      {/* Preview */}
      {value && (
        <div style={{ marginBottom: 12, position: "relative", display: "inline-block" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={value}
            alt="preview"
            style={{ maxWidth: 240, maxHeight: 180, objectFit: "cover", border: "1px solid #2a2a2a", borderRadius: 4, display: "block" }}
          />
          <button
            type="button"
            onClick={() => onChange("")}
            style={{
              position: "absolute", top: 4, right: 4,
              background: "rgba(0,0,0,0.7)", border: "none", color: "#fff",
              borderRadius: "50%", width: 20, height: 20, fontSize: 11,
              cursor: "pointer", lineHeight: "20px", textAlign: "center",
            }}
          >×</button>
        </div>
      )}

      {/* Drop zone */}
      <div
        onClick={() => inputRef.current?.click()}
        onDrop={handleDrop}
        onDragOver={e => e.preventDefault()}
        style={{
          border: "1px dashed #333",
          borderRadius: 4,
          padding: "20px 16px",
          textAlign: "center",
          cursor: "pointer",
          background: "#111",
          transition: "border-color 0.2s",
        }}
        onMouseEnter={e => (e.currentTarget.style.borderColor = "#8c7355")}
        onMouseLeave={e => (e.currentTarget.style.borderColor = "#333")}
      >
        {uploading ? (
          <p style={{ color: "#666", fontSize: 12 }}>上傳中...</p>
        ) : (
          <p style={{ color: "#555", fontSize: 12 }}>點擊或拖曳上傳圖片<br />JPG · PNG · WebP · 最大 10MB</p>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        style={{ display: "none" }}
        onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f); }}
      />

      {/* URL fallback */}
      <input
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder="或直接貼上圖片 URL"
        style={{
          marginTop: 8, display: "block", width: "100%", padding: "6px 8px",
          background: "#1a1a1a", border: "1px solid #2a2a2a", borderRadius: 4,
          color: "#e5e5e5", fontSize: 12, boxSizing: "border-box",
        }}
      />

      {info && <p style={{ color: "#666", fontSize: 11, marginTop: 4 }}>{info}</p>}
      {error && <p style={{ color: "#f87171", fontSize: 11, marginTop: 4 }}>{error}</p>}
    </div>
  );
}
