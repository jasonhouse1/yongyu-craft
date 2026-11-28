"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";

function hasAdminKey(): boolean {
  if (typeof document === "undefined") return false;
  return /(?:^|;\s*)admin_key=[^;]+/.test(document.cookie);
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const isLoginPage = pathname === "/admin/login";

  useEffect(() => {
    if (!mounted) return;
    if (!isLoginPage && !hasAdminKey()) router.replace("/admin/login");
  }, [mounted, isLoginPage, pathname, router]);

  // Don't flash protected admin content to a visitor being redirected to login.
  if (mounted && !isLoginPage && !hasAdminKey()) {
    return <div style={{ minHeight: "100vh", background: "#0a0a0a" }} />;
  }

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
          style={{ ...navLinkStyle, marginLeft: "auto", background: "none", border: "none", cursor: "pointer", color: "#888" }}
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
