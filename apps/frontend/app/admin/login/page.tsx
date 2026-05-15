"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const [key, setKey] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!key.trim()) {
      setError("請輸入 Admin Key");
      return;
    }
    setLoading(true);
    document.cookie = `admin_key=${encodeURIComponent(key.trim())}; path=/; max-age=86400; samesite=strict`;
    router.push("/admin");
    router.refresh();
  }

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "calc(100vh - 52px)",
      }}
    >
      <div
        style={{
          width: 360,
          background: "#111",
          border: "1px solid #1f1f1f",
          borderRadius: 8,
          padding: "32px 28px",
        }}
      >
        <h1
          style={{
            color: "#e5e5e5",
            fontSize: 18,
            fontWeight: 500,
            marginBottom: 24,
          }}
        >
          後台登入
        </h1>
        <form onSubmit={handleSubmit}>
          <label
            htmlFor="admin-key"
            style={{
              display: "block",
              color: "#888",
              fontSize: 12,
              marginBottom: 8,
              letterSpacing: "0.04em",
            }}
          >
            ADMIN KEY
          </label>
          <input
            id="admin-key"
            type="password"
            value={key}
            onChange={(e) => {
              setKey(e.target.value);
              setError("");
            }}
            style={{
              width: "100%",
              padding: "10px 12px",
              background: "#1a1a1a",
              border: "1px solid #2a2a2a",
              borderRadius: 4,
              color: "#e5e5e5",
              fontSize: 14,
              boxSizing: "border-box",
              outline: "none",
            }}
            autoFocus
          />
          {error && (
            <p style={{ color: "#f87171", fontSize: 12, marginTop: 8 }}>
              {error}
            </p>
          )}
          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              marginTop: 16,
              padding: "10px",
              background: loading ? "#5a4a38" : "#8c7355",
              border: "none",
              borderRadius: 4,
              color: "#fff",
              fontSize: 14,
              cursor: loading ? "not-allowed" : "pointer",
            }}
          >
            {loading ? "登入中..." : "登入"}
          </button>
        </form>
      </div>
    </div>
  );
}
