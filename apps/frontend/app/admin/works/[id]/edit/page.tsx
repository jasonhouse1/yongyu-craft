"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000";
const CATEGORIES = ["rings", "necklaces", "bracelets", "earrings", "custom"];
const PRICE_TYPES = ["fixed", "range", "inquiry"] as const;
const STATUSES = ["draft", "published", "archived"] as const;

function getAdminKey(): string {
  if (typeof document === "undefined") return "";
  const m = document.cookie.match(/(?:^|;\s*)admin_key=([^;]*)/);
  return m ? decodeURIComponent(m[1]) : "";
}

type WorkForm = {
  titleZh: string;
  titleEn: string;
  subtitleZh: string;
  descriptionZh: string;
  storyZh: string;
  categoryId: string;
  priceType: (typeof PRICE_TYPES)[number];
  price: string;
  currency: string;
  status: (typeof STATUSES)[number];
  isFeatured: boolean;
  isAvailable: boolean;
  isCustomizable: boolean;
  sortOrder: string;
};

const EMPTY: WorkForm = {
  titleZh: "", titleEn: "", subtitleZh: "", descriptionZh: "", storyZh: "",
  categoryId: "rings", priceType: "inquiry", price: "", currency: "TWD",
  status: "draft", isFeatured: false, isAvailable: true, isCustomizable: false, sortOrder: "0",
};

export default function AdminEditWorkPage() {
  const params = useParams();
  const id = Array.isArray(params.id) ? params.id[0] : (params.id as string);
  const router = useRouter();

  const [form, setForm] = useState<WorkForm>(EMPTY);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  function set<K extends keyof WorkForm>(k: K, v: WorkForm[K]) {
    setForm(p => ({ ...p, [k]: v }));
  }

  useEffect(() => {
    if (!id) return;
    fetch(`${API_URL}/api/admin/works/${id}`, {
      headers: { "x-admin-key": getAdminKey() },
    })
      .then(r => r.ok ? r.json() : Promise.reject(r.status))
      .then(w => {
        setForm({
          titleZh: w.titleZh ?? "",
          titleEn: w.titleEn ?? "",
          subtitleZh: w.subtitleZh ?? "",
          descriptionZh: w.descriptionZh ?? "",
          storyZh: w.storyZh ?? "",
          categoryId: w.categoryId ?? "rings",
          priceType: w.priceType ?? "inquiry",
          price: w.price != null ? String(w.price) : "",
          currency: w.currency ?? "TWD",
          status: w.status ?? "draft",
          isFeatured: w.isFeatured ?? false,
          isAvailable: w.isAvailable ?? true,
          isCustomizable: w.isCustomizable ?? false,
          sortOrder: String(w.sortOrder ?? 0),
        });
      })
      .catch(() => setError("載入作品失敗"))
      .finally(() => setLoading(false));
  }, [id]);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!form.titleZh.trim()) { setError("作品名稱必填"); return; }
    setSaving(true); setError("");
    try {
      const body: Record<string, unknown> = {
        titleZh: form.titleZh.trim(),
        titleEn: form.titleEn.trim() || undefined,
        subtitleZh: form.subtitleZh.trim() || undefined,
        descriptionZh: form.descriptionZh.trim() || undefined,
        storyZh: form.storyZh.trim() || undefined,
        categoryId: form.categoryId,
        priceType: form.priceType,
        currency: form.currency,
        status: form.status,
        isFeatured: form.isFeatured,
        isAvailable: form.isAvailable,
        isCustomizable: form.isCustomizable,
        sortOrder: parseInt(form.sortOrder) || 0,
      };
      if (form.priceType === "fixed" && form.price) body.price = parseFloat(form.price);
      const res = await fetch(`${API_URL}/api/admin/works/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", "x-admin-key": getAdminKey() },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error((await res.json().catch(() => ({}))).message ?? `HTTP ${res.status}`);
      router.push("/admin/works");
    } catch (err) {
      setError(err instanceof Error ? err.message : "儲存失敗");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!confirm("確認刪除（封存）此作品？")) return;
    setDeleting(true); setError("");
    try {
      const res = await fetch(`${API_URL}/api/admin/works/${id}`, {
        method: "DELETE",
        headers: { "x-admin-key": getAdminKey() },
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      router.push("/admin/works");
    } catch {
      setError("刪除失敗");
      setDeleting(false);
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

  if (loading) return <p style={{ color: "#555", fontSize: 13 }}>載入中...</p>;

  return (
    <>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 500, color: "#e5e5e5", marginBottom: 4 }}>編輯作品</h1>
          <button onClick={() => router.back()} style={{ background: "none", border: "none", color: "#555", fontSize: 12, cursor: "pointer", padding: 0 }}>
            ← 返回列表
          </button>
        </div>
        <button
          onClick={handleDelete}
          disabled={deleting}
          style={{ padding: "8px 16px", background: "transparent", border: "1px solid #3a1a1a", borderRadius: 4, color: deleting ? "#555" : "#f87171", fontSize: 12, cursor: deleting ? "not-allowed" : "pointer" }}
        >
          {deleting ? "刪除中..." : "封存作品"}
        </button>
      </div>

      <div style={{ maxWidth: 680, background: "#111", border: "1px solid #1f1f1f", borderRadius: 8, padding: "28px 24px" }}>
        <form onSubmit={handleSave}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 }}>
            <div>
              <label style={label}>作品名稱（中）*</label>
              <input style={field} value={form.titleZh} onChange={e => set("titleZh", e.target.value)} />
            </div>
            <div>
              <label style={label}>作品名稱（英）</label>
              <input style={field} value={form.titleEn} onChange={e => set("titleEn", e.target.value)} />
            </div>
          </div>

          <div style={group}>
            <label style={label}>副標題</label>
            <input style={field} value={form.subtitleZh} onChange={e => set("subtitleZh", e.target.value)} />
          </div>

          <div style={group}>
            <label style={label}>作品描述</label>
            <textarea style={{ ...field, minHeight: 80, resize: "vertical" }} value={form.descriptionZh} onChange={e => set("descriptionZh", e.target.value)} />
          </div>

          <div style={group}>
            <label style={label}>作品故事</label>
            <textarea style={{ ...field, minHeight: 80, resize: "vertical" }} value={form.storyZh} onChange={e => set("storyZh", e.target.value)} />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16, marginBottom: 20 }}>
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
            <div>
              <label style={label}>排序</label>
              <input style={field} type="number" value={form.sortOrder} onChange={e => set("sortOrder", e.target.value)} />
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16, marginBottom: 20 }}>
            <div>
              <label style={label}>價格類型</label>
              <select style={field} value={form.priceType} onChange={e => set("priceType", e.target.value as typeof form.priceType)}>
                {PRICE_TYPES.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
            {form.priceType === "fixed" && (
              <div>
                <label style={label}>價格（NT$）</label>
                <input style={field} type="number" value={form.price} onChange={e => set("price", e.target.value)} />
              </div>
            )}
            <div>
              <label style={label}>幣別</label>
              <input style={field} value={form.currency} onChange={e => set("currency", e.target.value)} />
            </div>
          </div>

          <div style={{ display: "flex", gap: 24, marginBottom: 24, flexWrap: "wrap" }}>
            {(["isFeatured", "isAvailable", "isCustomizable"] as const).map(k => (
              <label key={k} style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
                <input type="checkbox" checked={form[k] as boolean} onChange={e => set(k, e.target.checked)} />
                <span style={{ color: "#888", fontSize: 13 }}>
                  {k === "isFeatured" ? "精選" : k === "isAvailable" ? "可購買" : "可客製"}
                </span>
              </label>
            ))}
          </div>

          {error && <p style={{ color: "#f87171", fontSize: 12, marginBottom: 16 }}>{error}</p>}

          <button
            type="submit"
            disabled={saving}
            style={{ padding: "10px 28px", background: saving ? "#5a4a38" : "#8c7355", border: "none", borderRadius: 4, color: "#fff", fontSize: 13, cursor: saving ? "not-allowed" : "pointer" }}
          >
            {saving ? "儲存中..." : "儲存變更"}
          </button>
        </form>
      </div>
    </>
  );
}
