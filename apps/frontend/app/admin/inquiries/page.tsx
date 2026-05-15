import { cookies } from "next/headers";
import InquiriesTable from "./_components/InquiriesTable";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000";

export const dynamic = "force-dynamic";

export default async function AdminInquiriesPage() {
  const cookieStore = await cookies();
  const adminKey = cookieStore.get("admin_key")?.value ?? "";

  let items: unknown[] = [];
  try {
    const res = await fetch(`${API_URL}/api/admin/inquiries?limit=100`, {
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
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 22, fontWeight: 500, color: "#e5e5e5", marginBottom: 4 }}>
          詢價管理
        </h1>
        <p style={{ color: "#555", fontSize: 12 }}>
          共 {items.length} 筆
        </p>
      </div>
      <InquiriesTable items={items as Parameters<typeof InquiriesTable>[0]["items"]} />
    </>
  );
}
