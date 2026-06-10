"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ImageUploader from "@/components/admin/ImageUploader";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000";

const CATEGORIES = ["rings", "necklaces", "bracelets", "earrings", "custom"];
const PRICE_TYPES = ["fixed", "range", "inquiry"] as const;
const STATUSES = ["draft", "published", "archived"] as const;

function getAdminKey(): string {
  if (typeof document === "undefined") return "";
  const m = document.cookie.match(/(?:^|;\s*)admin_key=([^;]*)/);
  return m ? decodeURIComponent(m[1]) : "";
}

export default function AdminNewWorkPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    titleZh: "",
    titleEn: "",
    subtitleZh: "",
    categoryId: "rings",
    priceType: "inquiry" as (typeof PRICE_TYPES)[number],
    price: "",
    status: "draft" as (typeof STATUSES)[number],
    isFeatured: false,
    coverImage: "",
  });

  function set<K extends keyof typeof form>(k: K, v: (typeof form)[K]) {
    setForm((p) => ({ ...p, [k]: v }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.titleZh.trim()) { setError("作品名稱必填"); return; }
    setSaving(true);
    setError("");
    try {
      const body: Record<string, unknown> = {
        titleZh: form.titleZh.trim(),
        titleEn: form.titleEn.trim() || undefined,
        subtitleZh: form.subtitleZh.trim() || undefined,
        categoryId: form.categoryId,
        priceType: form.priceType,
        status: form.status,
        isFeatured: form.isFeatured,
        coverImage: form.coverImage.trim() || undefined,
      };
      if (form.priceType === "fixed" && form.price) {
        body.price = parseFloat(form.price);
      }
      const res = await fetch(`${API_URL}/api/admin/works`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-admin-key": getAdminKey() },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message ?? `HTTP ${res.status}`);
      }
      router.push("/admin/works");
    } catch (err) {
      setError(err instanceof Error ? err.message : "儲存失敗");
    } finally {
      setSaving(false);
    }
  }

  const field: React.CSSProperties = {
    display: "block", width: "100%", padding: "8px 10px",
    background: "#1a1a1a", border: "1px solid #2a2a2a", borderRadius: 4,
    color: "#e5e5e5", fontSize: 13, boxSizing: "border-box",
  };
  const label: React.CSSProperties = {
    display: "block", color: "#666", fontSize: 11,
    letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 6,
  };
  const group: React.CSSProperties = { marginBottom: 20 };

  return (
    <>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 500, color: "#e5e5e5", marginBottom: 4 }}>新增作品</h1>
          <button onClick={() => router.back()} style={{ background: "none", border: "none", color: "#555", fontSize: 12, cursor: "pointer", padding: 0 }}>
            ← 返回列表
          </button>
        </div>
      </div>

      <div style={{ maxWidth: 640, background: "#111", border: "1px solid #1f1f1f", borderRadius: 8, padding: "28px 24px" }}>
        <form onSubmit={handleSubmit}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 }}>
            <div>
              <label style={label}>作品名稱（中）*</label>
              <input style={field} value={form.titleZh} onChange={e => set("titleZh", e.target.value)} placeholder="Lumière Ring" />
            </div>
            <div>
              <label style={label}>作品名稱（英）</label>
              <input style={field} value={form.titleEn} onChange={e => set("titleEn", e.target.value)} placeholder="Lumiere Ring" />
            </div>
          </div>

          <div style={group}>
            <label style={label}>副標題</label>
            <input style={field} value={form.subtitleZh} onChange={e => set("subtitleZh", e.target.value)} />
          </div>

          <div style={group}>
            <label style={label}>封面圖片</label>
            <ImageUploader value={form.coverImage} onChange={v => set("coverImage", v)} />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 }}>
            <div>
              <label style={label}>分類</label>
              <select style={field} value={form.categoryId} onChange={e => set("categoryId", e.target.value)}>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label style={label}>狀態</label>
              <select style={field} value={form.status} onChange={e => set("status", e.target.value as typeof form.status)}>
                {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 }}>
            <div>
              <label style={label}>價格類型</label>
              <select style={field} value={form.priceType} onChange={e => set("priceType", e.target.value as typeof form.priceType)}>
                {PRICE_TYPES.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
            {form.priceType === "fixed" && (
              <div>
                <label style={label}>價格（NT$）</label>
                <input style={field} type="number" value={form.price} onChange={e => set("price", e.target.value)} placeholder="0" />
              </div>
            )}
          </div>

          <div style={{ marginBottom: 24 }}>
            <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
              <input type="checkbox" checked={form.isFeatured} onChange={e => set("isFeatured", e.target.checked)} />
              <span style={{ color: "#888", fontSize: 13 }}>精選作品</span>
            </label>
          </div>

          {error && <p style={{ color: "#f87171", fontSize: 12, marginBottom: 16 }}>{error}</p>}

          <button
            type="submit"
            disabled={saving}
            style={{
              padding: "10px 28px", background: saving ? "#5a4a38" : "#8c7355",
              border: "none", borderRadius: 4, color: "#fff", fontSize: 13,
              cursor: saving ? "not-allowed" : "pointer",
            }}
          >
            {saving ? "儲存中..." : "新增作品"}
          </button>
        </form>
      </div>
    </>
  );
}
