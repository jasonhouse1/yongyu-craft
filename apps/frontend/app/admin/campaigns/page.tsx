"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000";

function getAdminKey(): string {
  if (typeof document === "undefined") return "";
  const m = document.cookie.match(/(?:^|;\s*)admin_key=([^;]*)/);
  return m ? decodeURIComponent(m[1]) : "";
}

interface Campaign {
  id: string;
  title: string;
  subtitle: string | null;
  ctaText: string | null;
  isActive: boolean;
  startDate: string | null;
  endDate: string | null;
  bgColor: string;
  accentColor: string;
  createdAt: string;
}

function campaignStatus(c: Campaign): { label: string; color: string } {
  const now = new Date();
  if (!c.isActive) return { label: "停用", color: "#555" };
  const start = c.startDate ? new Date(c.startDate) : null;
  const end = c.endDate ? new Date(c.endDate) : null;
  if (start && now < start) return { label: "排程中", color: "#8c7355" };
  if (end && now > end) return { label: "已過期", color: "#555" };
  return { label: "進行中", color: "#4ade80" };
}

export default function AdminCampaignsPage() {
  const router = useRouter();
  const [items, setItems] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [toggling, setToggling] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/admin/campaigns`, {
        headers: { "x-admin-key": getAdminKey() },
      });
      const data = await res.json();
      setItems(data.items ?? []);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  async function toggleActive(c: Campaign) {
    setToggling(c.id);
    try {
      await fetch(`${API_URL}/api/admin/campaigns/${c.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", "x-admin-key": getAdminKey() },
        body: JSON.stringify({ isActive: !c.isActive }),
      });
      await load();
    } finally {
      setToggling(null);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("確認刪除此活動？")) return;
    await fetch(`${API_URL}/api/admin/campaigns/${id}`, {
      method: "DELETE",
      headers: { "x-admin-key": getAdminKey() },
    });
    await load();
  }

  const cell: React.CSSProperties = { padding: "12px 16px", fontSize: 13, color: "#E8ECF0", borderBottom: "1px solid #1A1815" };
  const th: React.CSSProperties = { padding: "10px 16px", fontSize: "0.75rem", color: "#C49A5A", letterSpacing: "0.2em", textTransform: "uppercase", borderBottom: "1px solid #1A1815", textAlign: "left", fontWeight: 400 };

  return (
    <>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28 }}>
        <h1 className="admin-page-title">活動橫幅</h1>
        <Link
          href="/admin/campaigns/new"
          style={{ padding: "8px 20px", background: "#8c7355", border: "none", borderRadius: 4, color: "#fff", fontSize: 13, textDecoration: "none" }}
        >
          + 新增活動
        </Link>
      </div>

      {loading ? (
        <p style={{ color: "#A8A39D", fontSize: "0.875rem" }}>載入中...</p>
      ) : items.length === 0 ? (
        <p className="admin-empty">尚無活動</p>
      ) : (
        <div className="admin-table-container">
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th style={th}>標題</th>
                <th style={th}>副標題</th>
                <th style={th}>狀態</th>
                <th style={th}>期間</th>
                <th style={th}>顏色</th>
                <th style={th}>操作</th>
              </tr>
            </thead>
            <tbody>
              {items.map(c => {
                const status = campaignStatus(c);
                return (
                  <tr key={c.id}>
                    <td style={cell}>{c.title}</td>
                    <td style={{ ...cell, color: "#9A9590" }}>{c.subtitle ?? "—"}</td>
                    <td style={cell}>
                      <span style={{ color: status.color, fontSize: 12 }}>{status.label}</span>
                    </td>
                    <td style={{ ...cell, fontSize: 12, color: "#A8A39D" }}>
                      {c.startDate ? new Date(c.startDate).toLocaleDateString("zh-TW") : "—"}
                      {" → "}
                      {c.endDate ? new Date(c.endDate).toLocaleDateString("zh-TW") : "無限期"}
                    </td>
                    <td style={cell}>
                      <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                        <div style={{ width: 14, height: 14, borderRadius: 3, background: c.bgColor, border: "1px solid #333" }} />
                        <div style={{ width: 14, height: 14, borderRadius: 3, background: c.accentColor, border: "1px solid #333" }} />
                      </div>
                    </td>
                    <td style={cell}>
                      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                        <button
                          onClick={() => toggleActive(c)}
                          disabled={toggling === c.id}
                          style={{
                            padding: "4px 10px", fontSize: 11, borderRadius: 3, cursor: "pointer", border: "none",
                            background: c.isActive ? "#1a3a1a" : "#2a2a2a",
                            color: c.isActive ? "#4ade80" : "#888",
                          }}
                        >
                          {toggling === c.id ? "..." : c.isActive ? "停用" : "啟用"}
                        </button>
                        <button
                          onClick={() => router.push(`/admin/campaigns/${c.id}/edit`)}
                          style={{ padding: "4px 10px", fontSize: 11, borderRadius: 3, cursor: "pointer", border: "1px solid #2a2a2a", background: "transparent", color: "#888" }}
                        >
                          編輯
                        </button>
                        <button
                          onClick={() => handleDelete(c.id)}
                          style={{ padding: "4px 10px", fontSize: 11, borderRadius: 3, cursor: "pointer", border: "1px solid #3a1a1a", background: "transparent", color: "#f87171" }}
                        >
                          刪除
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
