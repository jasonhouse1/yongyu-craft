import Link from "next/link";

const CARDS = [
  {
    href: "/admin/works",
    label: "作品管理",
    desc: "新增、編輯、下架作品",
    accent: "#c4a87a",
  },
  {
    href: "/admin/inquiries",
    label: "詢價管理",
    desc: "查看並處理客戶詢價",
    accent: "#7ab8c4",
  },
];

export default function AdminPage() {
  return (
    <>
      <h1 className="admin-page-title">控制台</h1>
      <p className="admin-subtitle">永裕工藝後台管理系統</p>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
          gap: 16,
        }}
      >
        {CARDS.map((c) => (
          <Link key={c.href} href={c.href} style={{ textDecoration: "none" }}>
            <div
              style={{
                background: "#111",
                border: "1px solid #1f1f1f",
                borderRadius: 8,
                padding: "24px 20px",
              }}
            >
              <div
                style={{
                  width: 4,
                  height: 20,
                  background: c.accent,
                  borderRadius: 2,
                  marginBottom: 12,
                }}
              />
              <div
                style={{
                  fontSize: 16,
                  fontWeight: 500,
                  color: "#e5e5e5",
                  marginBottom: 6,
                }}
              >
                {c.label}
              </div>
              <div style={{ fontSize: 12, color: "#A8A39D" }}>{c.desc}</div>
            </div>
          </Link>
        ))}
      </div>
    </>
  );
}
