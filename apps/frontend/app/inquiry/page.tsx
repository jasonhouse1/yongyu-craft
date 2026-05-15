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
    <main style={{ backgroundColor: "var(--yyc-bg)", minHeight: "100vh" }}>
      <nav
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 50,
          padding: "1.5rem 3rem",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          backgroundColor: "var(--yyc-bg)",
          borderBottom: "1px solid var(--yyc-border)",
        }}
      >
        <Link
          href="/"
          style={{
            fontFamily: "var(--font-noto-serif-tc)",
            fontSize: "1rem",
            letterSpacing: "0.15em",
            color: "var(--yyc-ink)",
          }}
        >
          {t.nav.brand}
        </Link>
        <div style={{ display: "flex", gap: "2.5rem" }}>
          {[
            { href: "/works", label: t.nav.works },
            { href: "/about", label: t.nav.about },
            { href: "/contact", label: t.nav.contact },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              style={{
                fontSize: "0.8125rem",
                letterSpacing: "0.08em",
                color: "var(--yyc-ink)",
                opacity: 0.6,
              }}
            >
              {item.label}
            </Link>
          ))}
        </div>
      </nav>

      <section style={{ paddingTop: "6rem", padding: "6rem 3rem 0" }}>
        <p
          style={{
            fontSize: "0.75rem",
            letterSpacing: "0.2em",
            color: "var(--yyc-gold)",
            marginBottom: "1rem",
            textTransform: "uppercase",
          }}
        >
          INQUIRY
        </p>
        <h1
          style={{
            fontFamily: "var(--font-noto-serif-tc)",
            fontSize: "clamp(1.75rem, 4vw, 2.5rem)",
            fontWeight: 300,
            letterSpacing: "0.08em",
            color: "var(--yyc-ink)",
            marginBottom: "0.75rem",
          }}
        >
          {t.inquiry.title}
        </h1>
        <p
          style={{
            fontSize: "0.875rem",
            color: "var(--yyc-sand)",
            letterSpacing: "0.05em",
          }}
        >
          {t.inquiry.subtitle}
        </p>
      </section>

      <InquiryForm workId={workId} workTitle={work?.titleZh} />

      <footer
        style={{
          backgroundColor: "var(--yyc-dark)",
          padding: "3rem",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "1rem",
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-noto-serif-tc)",
            fontSize: "0.875rem",
            letterSpacing: "0.12em",
            color: "var(--yyc-sand)",
          }}
        >
          {t.footer.brand}
        </span>
        <span
          style={{
            fontSize: "0.75rem",
            color: "rgba(196,180,154,0.4)",
            letterSpacing: "0.05em",
          }}
        >
          {t.footer.copyright}
        </span>
      </footer>
    </main>
  );
}
