import { getWorks } from "@/lib/api";
import messages from "@/messages/zh.json";
import Link from "next/link";
import RingHero from "@/components/hero/RingHero";

export default async function HomePage() {
  const { items: works } = await getWorks({ limit: 3 }).catch(() => ({
    items: [],
  }));
  const t = messages;

  return (
    <main>
      <RingHero />

      {works.length > 0 && (
        <section style={{ padding: "6rem 3rem" }}>
          <p style={{
            fontSize: "0.75rem",
            letterSpacing: "0.2em",
            color: "var(--yyc-sand)",
            marginBottom: "3rem",
            textTransform: "uppercase",
          }}>
            {t.works.sectionLabel}
          </p>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "2rem",
          }}>
            {works.map((work) => (
              <Link
                key={work.id}
                href={`/works/${work.categoryId}/${work.id}`}
                style={{ display: "block" }}
              >
                <div style={{
                  aspectRatio: "4/5",
                  backgroundColor: "var(--yyc-sand)",
                  opacity: 0.3,
                  marginBottom: "1.25rem",
                }} />
                <p style={{
                  fontSize: "0.75rem",
                  letterSpacing: "0.12em",
                  color: "var(--yyc-sand)",
                  marginBottom: "0.5rem",
                }}>
                  {work.categoryId}
                </p>
                <p style={{
                  fontSize: "0.9375rem",
                  letterSpacing: "0.05em",
                  color: "var(--yyc-ink)",
                }}>
                  {work.titleZh}
                </p>
                {work.priceType === "fixed" && work.price && (
                  <p style={{
                    fontSize: "0.8125rem",
                    color: "var(--yyc-gold)",
                    marginTop: "0.5rem",
                    letterSpacing: "0.05em",
                  }}>
                    {t.works.pricePrefix} {work.price.toLocaleString()}
                  </p>
                )}
                {work.priceType === "inquiry" && (
                  <p style={{
                    fontSize: "0.8125rem",
                    color: "var(--yyc-sand)",
                    marginTop: "0.5rem",
                  }}>
                    {t.works.inquiryLabel}
                  </p>
                )}
              </Link>
            ))}
          </div>
        </section>
      )}

      <footer style={{
        backgroundColor: "var(--yyc-dark)",
        padding: "3rem",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
        gap: "1rem",
      }}>
        <span style={{
          fontFamily: "var(--font-noto-serif-tc)",
          fontSize: "0.875rem",
          letterSpacing: "0.12em",
          color: "var(--yyc-sand)",
        }}>
          {t.footer.brand}
        </span>
        <span style={{
          fontSize: "0.75rem",
          color: "rgba(196,180,154,0.4)",
          letterSpacing: "0.05em",
        }}>
          {t.footer.copyright}
        </span>
      </footer>
    </main>
  );
}
