"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000";

function getAdminKey(): string {
  if (typeof document === "undefined") return "";
  const m = document.cookie.match(/(?:^|;\s*)admin_key=([^;]*)/);
  return m ? decodeURIComponent(m[1]) : "";
}

function toDatetimeLocal(iso: string | null | undefined): string {
  if (!iso) return "";
  return new Date(iso).toISOString().slice(0, 16);
}

const DEFAULTS = {
  title: "",
  subtitle: "",
  ctaText: "",
  ctaUrl: "",
  isActive: false,
  startDate: "",
  endDate: "",
  bgColor: "#0D0C0B",
  accentColor: "#C49A5A",
};

export default function AdminEditCampaignPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [form, setForm] = useState(DEFAULTS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function set<K extends keyof typeof form>(k: K, v: (typeof form)[K]) {
    setForm(p => ({ ...p, [k]: v }));
  }

  useEffect(() => {
    if (!id) return;
    fetch(`${API_URL}/api/admin/campaigns/${id}`, {
      headers: { "x-admin-key": getAdminKey() },
    })
      .then(r => r.ok ? r.json() : Promise.reject(r.status))
      .then(c => {
        setForm({
          title: c.title ?? "",
          subtitle: c.subtitle ?? "",
          ctaText: c.ctaText ?? "",
          ctaUrl: c.ctaUrl ?? "",
          isActive: c.isActive ?? false,
          startDate: toDatetimeLocal(c.startDate),
          endDate: toDatetimeLocal(c.endDate),
          bgColor: c.bgColor ?? "#0D0C0B",
          accentColor: c.accentColor ?? "#C49A5A",
        });
      })
      .catch(() => setError("載入失敗"))
      .finally(() => setLoading(false));
  }, [id]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title.trim()) { setError("活動標題必填"); return; }
    setSaving(true); setError("");
    try {
      const body: Record<string, unknown> = {
        title: form.title.trim(),
        subtitle: form.subtitle.trim() || undefined,
        ctaText: form.ctaText.trim() || undefined,
        ctaUrl: form.ctaUrl.trim() || undefined,
        isActive: form.isActive,
        startDate: form.startDate || null,
        endDate: form.endDate || null,
        bgColor: form.bgColor,
        accentColor: form.accentColor,
      };
      const res = await fetch(`${API_URL}/api/admin/campaigns/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", "x-admin-key": getAdminKey() },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error((await res.json().catch(() => ({}))).message ?? `HTTP ${res.status}`);
      router.push("/admin/campaigns");
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

  if (loading) return <p style={{ color: "#555", fontSize: 13 }}>載入中...</p>;

  return (
    <>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 22, fontWeight: 500, color: "#e5e5e5", marginBottom: 4 }}>編輯活動橫幅</h1>
        <button onClick={() => router.back()} style={{ background: "none", border: "none", color: "#555", fontSize: 12, cursor: "pointer", padding: 0 }}>
          ← 返回列表
        </button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32, alignItems: "start" }}>
        <div style={{ background: "#111", border: "1px solid #1f1f1f", borderRadius: 8, padding: "28px 24px" }}>
          <form onSubmit={handleSubmit}>
            <div style={group}>
              <label style={label}>活動標題 *</label>
              <input style={field} value={form.title} onChange={e => set("title", e.target.value)} />
            </div>

            <div style={group}>
              <label style={label}>副標題</label>
              <input style={field} value={form.subtitle} onChange={e => set("subtitle", e.target.value)} />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 }}>
              <div>
                <label style={label}>按鈕文字</label>
                <input style={field} value={form.ctaText} onChange={e => set("ctaText", e.target.value)} />
              </div>
              <div>
                <label style={label}>連結網址</label>
                <input style={field} value={form.ctaUrl} onChange={e => set("ctaUrl", e.target.value)} />
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 }}>
              <div>
                <label style={label}>開始日期</label>
                <input type="datetime-local" style={field} value={form.startDate} onChange={e => set("startDate", e.target.value)} />
              </div>
              <div>
                <label style={label}>結束日期</label>
                <input type="datetime-local" style={field} value={form.endDate} onChange={e => set("endDate", e.target.value)} />
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 }}>
              <div>
                <label style={label}>背景色</label>
                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  <input type="color" value={form.bgColor} onChange={e => set("bgColor", e.target.value)}
                    style={{ width: 36, height: 32, padding: 2, background: "#1a1a1a", border: "1px solid #2a2a2a", borderRadius: 4, cursor: "pointer" }} />
                  <input style={{ ...field, flex: 1 }} value={form.bgColor} onChange={e => set("bgColor", e.target.value)} />
                </div>
              </div>
              <div>
                <label style={label}>強調色</label>
                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  <input type="color" value={form.accentColor} onChange={e => set("accentColor", e.target.value)}
                    style={{ width: 36, height: 32, padding: 2, background: "#1a1a1a", border: "1px solid #2a2a2a", borderRadius: 4, cursor: "pointer" }} />
                  <input style={{ ...field, flex: 1 }} value={form.accentColor} onChange={e => set("accentColor", e.target.value)} />
                </div>
              </div>
            </div>

            <div style={{ marginBottom: 24 }}>
              <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
                <input type="checkbox" checked={form.isActive} onChange={e => set("isActive", e.target.checked)} />
                <span style={{ color: "#888", fontSize: 13 }}>啟用</span>
              </label>
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

        {/* Live preview */}
        <div>
          <p style={{ color: "#555", fontSize: 11, letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 12 }}>預覽</p>
          <div style={{ background: "#0a0a0a", borderRadius: 8, overflow: "hidden", border: "1px solid #1f1f1f" }}>
            <div style={{
              position: "relative", height: 52,
              backgroundColor: form.bgColor,
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 1, backgroundColor: form.accentColor, opacity: 0.3 }} />
              <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 1, backgroundColor: form.accentColor, opacity: 0.3 }} />
              <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "0 48px 0 16px" }}>
                <span style={{ fontSize: "0.8rem", color: "#F0EBE0", letterSpacing: "0.1em", fontWeight: 300, whiteSpace: "nowrap" }}>
                  {form.title || "活動標題"}
                </span>
                {form.subtitle && (
                  <>
                    <span style={{ color: form.accentColor, opacity: 0.5 }}>·</span>
                    <span style={{ fontSize: "0.8rem", color: form.accentColor, letterSpacing: "0.08em", fontWeight: 300, whiteSpace: "nowrap" }}>{form.subtitle}</span>
                  </>
                )}
                {form.ctaText && (
                  <>
                    <span style={{ color: form.accentColor, opacity: 0.5 }}>·</span>
                    <span style={{ fontSize: "0.75rem", color: form.accentColor, letterSpacing: "0.12em", borderBottom: `1px solid ${form.accentColor}`, whiteSpace: "nowrap" }}>{form.ctaText}</span>
                  </>
                )}
              </div>
              <div style={{ position: "absolute", right: 16, top: "50%", transform: "translateY(-50%)", color: form.accentColor, opacity: 0.45, fontSize: "1.1rem" }}>×</div>
            </div>
            <div style={{ padding: "20px 16px", background: "#0a0a0a" }}>
              <div style={{ height: 12, background: "#1a1a1a", borderRadius: 4, marginBottom: 8, width: "60%" }} />
              <div style={{ height: 8, background: "#151515", borderRadius: 4, marginBottom: 6, width: "80%" }} />
              <div style={{ height: 8, background: "#151515", borderRadius: 4, width: "50%" }} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
