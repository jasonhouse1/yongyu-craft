"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000";

type WorkItem = {
  id: string;
  slug: string;
  titleZh: string;
  categoryId: string;
  status: string;
  priceType: string;
  isAvailable: boolean;
  sortOrder: number;
};

const STATUS_COLOR: Record<string, string> = {
  published: "#22c55e",
  draft: "#f59e0b",
  archived: "#6b7280",
};

function getAdminKey(): string {
  if (typeof document === "undefined") return "";
  const m = document.cookie.match(/(?:^|;\s*)admin_key=([^;]*)/);
  return m ? decodeURIComponent(m[1]) : "";
}

export default function WorksTable({ items }: { items: WorkItem[] }) {
  const router = useRouter();
  const [deleting, setDeleting] = useState<string | null>(null);

  async function handleDelete(work: WorkItem) {
    if (!confirm(`確認刪除「${work.titleZh}」？此操作不可逆。`)) return;
    setDeleting(work.id);
    try {
      const res = await fetch(`${API_URL}/api/admin/works/${work.id}`, {
        method: "DELETE",
        headers: { "x-admin-key": getAdminKey() },
      });
      if (!res.ok) throw new Error("刪除失敗");
      router.refresh();
    } catch {
      alert("刪除失敗，請重試");
    } finally {
      setDeleting(null);
    }
  }

  if (items.length === 0) {
    return (
      <div
        style={{
          background: "#111",
          border: "1px solid #1f1f1f",
          borderRadius: 8,
          padding: "48px 0",
          textAlign: "center",
          color: "#444",
          fontSize: 14,
        }}
      >
        尚無作品
      </div>
    );
  }

  return (
    <div
      style={{
        background: "#111",
        border: "1px solid #1f1f1f",
        borderRadius: 8,
        overflow: "hidden",
      }}
    >
      <table
        style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}
      >
        <thead>
          <tr style={{ borderBottom: "1px solid #1f1f1f" }}>
            {["標題 / Slug", "分類", "狀態", "價格類型", ""].map((h) => (
              <th
                key={h}
                style={{
                  padding: "10px 16px",
                  textAlign: h === "" ? "right" : "left",
                  color: "#555",
                  fontWeight: 400,
                  fontSize: 11,
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                }}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {items.map((work) => (
            <tr
              key={work.id}
              style={{
                borderBottom: "1px solid #161616",
              }}
            >
              <td style={{ padding: "12px 16px" }}>
                <div style={{ color: "#e5e5e5" }}>{work.titleZh}</div>
                <div style={{ color: "#444", fontSize: 11, marginTop: 2 }}>
                  {work.slug}
                </div>
              </td>
              <td style={{ padding: "12px 16px", color: "#888" }}>
                {work.categoryId}
              </td>
              <td style={{ padding: "12px 16px" }}>
                <span
                  style={{
                    color: STATUS_COLOR[work.status] ?? "#888",
                    fontSize: 11,
                    background: "rgba(255,255,255,0.04)",
                    padding: "2px 8px",
                    borderRadius: 4,
                  }}
                >
                  {work.status}
                </span>
              </td>
              <td style={{ padding: "12px 16px", color: "#888" }}>
                {work.priceType}
              </td>
              <td style={{ padding: "12px 16px", textAlign: "right" }}>
                <button
                  onClick={() => handleDelete(work)}
                  disabled={deleting === work.id}
                  style={{
                    padding: "4px 10px",
                    background: "transparent",
                    border: "1px solid #333",
                    borderRadius: 4,
                    color: deleting === work.id ? "#555" : "#f87171",
                    cursor: deleting === work.id ? "not-allowed" : "pointer",
                    fontSize: 12,
                  }}
                >
                  {deleting === work.id ? "..." : "刪除"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
