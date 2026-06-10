"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0a0a0a",
        color: "#e5e5e5",
        fontFamily: "system-ui, -apple-system, sans-serif",
      }}
    >
      <nav
        style={{
          background: "#111",
          borderBottom: "1px solid #1f1f1f",
          padding: "0 24px",
          display: "flex",
          alignItems: "center",
          gap: "28px",
          height: "52px",
        }}
      >
        <Link
          href="/admin"
          style={{
            color: "#c4a87a",
            fontWeight: 600,
            letterSpacing: "0.05em",
            fontSize: "14px",
            textDecoration: "none",
          }}
        >
          永裕工藝 Admin
        </Link>
        <Link href="/admin/works" style={navLinkStyle}>
          作品
        </Link>
        <Link href="/admin/inquiries" style={navLinkStyle}>
          詢價
        </Link>
        <Link href="/admin/campaigns" style={navLinkStyle}>
          活動
        </Link>
        <button
          onClick={() => {
            document.cookie = "admin_key=; path=/; max-age=0";
            router.push("/admin/login");
          }}
          style={{ ...navLinkStyle, marginLeft: "auto", background: "none", border: "none", cursor: "pointer", color: "#555" }}
        >
          登出
        </button>
      </nav>
      <main
        style={{
          padding: "32px 24px",
          maxWidth: "1100px",
          margin: "0 auto",
        }}
      >
        {children}
      </main>
    </div>
  );
}

const navLinkStyle: React.CSSProperties = {
  color: "#888",
  textDecoration: "none",
  fontSize: "13px",
};
