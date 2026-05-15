"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000";

type InquiryItem = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  inquiryType: string;
  status: string;
  message: string;
  adminNote: string | null;
  createdAt: string;
};

const STATUS_OPTIONS = [
  "newInquiry",
  "pending",
  "replied",
  "contacted",
  "negotiating",
  "completed",
  "closed",
] as const;

const STATUS_COLOR: Record<string, string> = {
  newInquiry: "#f59e0b",
  pending: "#60a5fa",
  replied: "#a78bfa",
  contacted: "#34d399",
  negotiating: "#fb923c",
  completed: "#22c55e",
  closed: "#6b7280",
};

const STATUS_LABEL: Record<string, string> = {
  newInquiry: "新詢價",
  pending: "待處理",
  replied: "已回覆",
  contacted: "已聯繫",
  negotiating: "洽談中",
  completed: "已完成",
  closed: "已結案",
};

function getAdminKey(): string {
  if (typeof document === "undefined") return "";
  const m = document.cookie.match(/(?:^|;\s*)admin_key=([^;]*)/);
  return m ? decodeURIComponent(m[1]) : "";
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleString("zh-TW", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function InquiriesTable({ items }: { items: InquiryItem[] }) {
  const router = useRouter();
  const [updating, setUpdating] = useState<string | null>(null);
  const [selected, setSelected] = useState<Record<string, string>>({});

  async function handleUpdate(id: string) {
    const newStatus = selected[id];
    if (!newStatus) return;
    setUpdating(id);
    try {
      const res = await fetch(`${API_URL}/api/admin/inquiries/${id}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "x-admin-key": getAdminKey(),
        },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) throw new Error("更新失敗");
      router.refresh();
    } catch {
      alert("更新失敗，請重試");
    } finally {
      setUpdating(null);
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
        尚無詢價
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
            {["姓名 / Email", "類型", "狀態", "日期", "更新狀態"].map((h) => (
              <th
                key={h}
                style={{
                  padding: "10px 16px",
                  textAlign: "left",
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
          {items.map((inq) => (
            <tr
              key={inq.id}
              style={{ borderBottom: "1px solid #161616" }}
            >
              <td style={{ padding: "12px 16px" }}>
                <div style={{ color: "#e5e5e5" }}>{inq.name}</div>
                <div style={{ color: "#444", fontSize: 11, marginTop: 2 }}>
                  {inq.email}
                </div>
              </td>
              <td style={{ padding: "12px 16px", color: "#888" }}>
                {inq.inquiryType}
              </td>
              <td style={{ padding: "12px 16px" }}>
                <span
                  style={{
                    color: STATUS_COLOR[inq.status] ?? "#888",
                    fontSize: 11,
                    background: "rgba(255,255,255,0.04)",
                    padding: "2px 8px",
                    borderRadius: 4,
                  }}
                >
                  {STATUS_LABEL[inq.status] ?? inq.status}
                </span>
              </td>
              <td
                style={{
                  padding: "12px 16px",
                  color: "#555",
                  fontSize: 12,
                  whiteSpace: "nowrap",
                }}
              >
                {formatDate(inq.createdAt)}
              </td>
              <td style={{ padding: "12px 16px" }}>
                <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                  <select
                    value={selected[inq.id] ?? inq.status}
                    onChange={(e) =>
                      setSelected((prev) => ({
                        ...prev,
                        [inq.id]: e.target.value,
                      }))
                    }
                    style={{
                      background: "#1a1a1a",
                      border: "1px solid #2a2a2a",
                      borderRadius: 4,
                      color: "#aaa",
                      fontSize: 12,
                      padding: "4px 8px",
                      cursor: "pointer",
                    }}
                  >
                    {STATUS_OPTIONS.map((s) => (
                      <option key={s} value={s}>
                        {STATUS_LABEL[s]}
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={() => handleUpdate(inq.id)}
                    disabled={
                      updating === inq.id ||
                      (selected[inq.id] ?? inq.status) === inq.status
                    }
                    style={{
                      padding: "4px 10px",
                      background:
                        updating === inq.id ||
                        (selected[inq.id] ?? inq.status) === inq.status
                          ? "transparent"
                          : "#1e3a2a",
                      border: "1px solid",
                      borderColor:
                        updating === inq.id ||
                        (selected[inq.id] ?? inq.status) === inq.status
                          ? "#2a2a2a"
                          : "#22c55e",
                      borderRadius: 4,
                      color:
                        updating === inq.id ||
                        (selected[inq.id] ?? inq.status) === inq.status
                          ? "#444"
                          : "#22c55e",
                      cursor:
                        updating === inq.id ||
                        (selected[inq.id] ?? inq.status) === inq.status
                          ? "not-allowed"
                          : "pointer",
                      fontSize: 12,
                      whiteSpace: "nowrap",
                    }}
                  >
                    {updating === inq.id ? "..." : "確認"}
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
