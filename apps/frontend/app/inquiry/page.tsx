import { getWork } from "@/lib/api";
import messages from "@/messages/zh.json";
import Link from "next/link";
import InquiryForm from "./_components/InquiryForm";

export default async function InquiryPage({
  searchParams,
}: {
  searchParams: Promise<{ workId?: string; work?: string }>;
}) {
  const { workId, work: workName } = await searchParams;
  const t = messages;

  const work = workId ? await getWork(workId).catch(() => null) : null;
  const displayWorkName = work?.titleZh ?? workName ?? null;

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
              fontSize: "0.875rem",
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
          fontSize: "0.75rem",
          letterSpacing: "0.25em",
          color: "rgba(196,154,90,0.5)",
          marginBottom: "1.5rem",
          textTransform: "uppercase",
        }}>
          INQUIRY
        </p>
        <p style={{
          fontSize: "0.75rem",
          letterSpacing: "0.5em",
          color: "#C49A5A",
          marginBottom: "1rem",
          textTransform: "uppercase",
        }}>
          PRIVATE CONSULTATION
        </p>
        <h1 style={{
          fontFamily: "var(--font-noto-serif-tc)",
          fontSize: "clamp(2.5rem, 5vw, 5rem)",
          fontWeight: 300,
          letterSpacing: "0.3em",
          color: "#E8ECF0",
          marginBottom: "1rem",
          lineHeight: 1.3,
        }}>
          與師傅對話
        </h1>
        <p style={{
          fontSize: "0.875rem",
          color: "#A8A39D",
          letterSpacing: "0.08em",
          lineHeight: 1.8,
          borderLeft: "2px solid #C49A5A",
          paddingLeft: "1rem",
        }}>
          每一件作品，都從一個故事開始
        </p>
      </section>

      {displayWorkName && (
        <div style={{ padding: "1.5rem 3rem 0" }}>
          <p style={{ fontSize: "0.875rem", color: "#C49A5A", letterSpacing: "0.2em", fontWeight: 300 }}>
            您正在詢問：{displayWorkName}
          </p>
        </div>
      )}

      {/* Desktop two-column layout */}
      <div style={{
        padding: "0 3rem",
        display: "grid",
        gridTemplateColumns: "1fr",
        gap: "4rem",
      }}
        className="inquiry-layout"
      >
        <InquiryForm workId={workId} workTitle={displayWorkName ?? undefined} />

        {/* Right panel: brand info (desktop only) */}
        <aside style={{
          display: "none",
          paddingTop: "4rem",
          borderLeft: "1px solid #C49A5A",
          paddingLeft: "3rem",
          alignSelf: "start",
        }}
          className="inquiry-aside"
        >
          <p style={{
            fontFamily: "var(--font-noto-serif-tc)",
            fontSize: "clamp(1.25rem, 2vw, 1.75rem)",
            fontWeight: 300,
            color: "#E8ECF0",
            lineHeight: 1.8,
            letterSpacing: "0.08em",
            marginBottom: "3rem",
          }}>
            每一件作品，都從一段對話開始
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            {[
              { label: "48 小時回覆", desc: "師傅親自回覆每一封詢問" },
              { label: "台灣手工製作", desc: "每件作品皆由師傅手工打造" },
              { label: "客製化服務", desc: "從設計到完成全程陪伴" },
            ].map((item) => (
              <div key={item.label} style={{ display: "flex", gap: "1rem", alignItems: "flex-start" }}>
                <span style={{
                  width: "4px",
                  height: "4px",
                  borderRadius: "50%",
                  backgroundColor: "#C49A5A",
                  marginTop: "0.6rem",
                  flexShrink: 0,
                }} />
                <div>
                  <p style={{ fontSize: "0.875rem", color: "#E8ECF0", letterSpacing: "0.05em", marginBottom: "0.25rem" }}>
                    {item.label}
                  </p>
                  <p style={{ fontSize: "0.8125rem", color: "#A8A39D", letterSpacing: "0.03em" }}>
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </aside>
      </div>

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
