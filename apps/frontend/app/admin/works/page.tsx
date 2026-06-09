import { cookies } from "next/headers";
import WorksTable from "./_components/WorksTable";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000";

export const dynamic = "force-dynamic";

export default async function AdminWorksPage() {
  const cookieStore = await cookies();
  const adminKey = cookieStore.get("admin_key")?.value ?? "";

  let items: unknown[] = [];
  try {
    const res = await fetch(`${API_URL}/api/admin/works?limit=100`, {
      headers: { "x-admin-key": adminKey },
      cache: "no-store",
    });
    if (res.ok) {
      const data = await res.json();
      items = data.items ?? [];
    }
  } catch {
    // backend unreachable
  }

  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 24,
        }}
      >
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 500, color: "#e5e5e5", marginBottom: 4 }}>
            作品管理
          </h1>
          <p style={{ color: "#555", fontSize: 12 }}>
            共 {items.length} 筆
          </p>
        </div>
        <a
          href="/admin/works/new"
          style={{
            padding: "8px 18px",
            background: "#8c7355",
            border: "none",
            borderRadius: 4,
            color: "#fff",
            fontSize: 13,
            textDecoration: "none",
            whiteSpace: "nowrap",
          }}
        >
          ＋ 新增作品
        </a>
      </div>
      <WorksTable items={items as Parameters<typeof WorksTable>[0]["items"]} />
    </>
  );
}
