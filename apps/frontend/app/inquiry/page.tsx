import { getWork } from "@/lib/api";
import messages from "@/messages/zh.json";
import Link from "next/link";
import InquiryForm from "./_components/InquiryForm";

export default async function InquiryPage({
  searchParams,
}: {
  searchParams: Promise<{ workId?: string }>;
}) {
  const { workId } = await searchParams;
  const t = messages;

  const work = workId ? await getWork(workId).catch(() => null) : null;

  return (
    <main style={{ backgroundColor: "#080706", minHeight: "100vh" }}>
      <nav style={{
        position: "fixed",
        top: 0, left: 0, right: 0,
        zIndex: 50,
        padding: "1.5rem 3rem",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: "rgba(8,7,6,0.85)",
        backdropFilter: "blur(12px)",
        borderBottom: "1px solid rgba(196,154,90,0.08)",
      }}>
        <Link href="/" style={{
          fontFamily: "var(--font-noto-serif-tc)",
          fontSize: "1rem",
          letterSpacing: "0.15em",
          color: "#C49A5A",
        }}>
          YY
        </Link>
        <div style={{ display: "flex", gap: "2.5rem" }}>
          {[
            { href: "/works", label: t.nav.works },
            { href: "/about", label: t.nav.about },
            { href: "/contact", label: t.nav.contact },
          ].map((item) => (
            <Link key={item.href} href={item.href} style={{
              fontSize: "0.75rem",
              letterSpacing: "0.15em",
              color: "rgba(232,236,240,0.4)",
              fontWeight: 300,
            }}>
              {item.label}
            </Link>
          ))}
        </div>
      </nav>

      <section style={{ padding: "10rem 3rem 0" }}>
        <p style={{
          fontSize: "0.6875rem",
          letterSpacing: "0.25em",
          color: "rgba(196,154,90,0.5)",
          marginBottom: "1.5rem",
          textTransform: "uppercase",
        }}>
          INQUIRY
        </p>
        <h1 style={{
          fontFamily: "var(--font-noto-serif-tc)",
          fontSize: "clamp(2rem, 5vw, 3.5rem)",
          fontWeight: 300,
          letterSpacing: "0.1em",
          color: "#E8ECF0",
          marginBottom: "1rem",
          lineHeight: 1.3,
        }}>
          與師傅對話
        </h1>
        <p style={{
          fontSize: "0.875rem",
          color: "#6B6560",
          letterSpacing: "0.08em",
          lineHeight: 1.8,
        }}>
          每一件作品，都從一個故事開始
        </p>
      </section>

      <InquiryForm workId={workId} workTitle={work?.titleZh} />

      <footer style={{
        backgroundColor: "#0D0D0B",
        padding: "3rem",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
        gap: "1rem",
        borderTop: "1px solid rgba(196,154,90,0.08)",
      }}>
        <span style={{
          fontFamily: "var(--font-noto-serif-tc)",
          fontSize: "0.875rem",
          letterSpacing: "0.12em",
          color: "rgba(196,154,90,0.55)",
        }}>
          {t.footer.brand}
        </span>
        <span style={{ fontSize: "0.75rem", color: "rgba(232,236,240,0.18)", letterSpacing: "0.05em" }}>
          {t.footer.copyright}
        </span>
      </footer>
    </main>
  );
}
