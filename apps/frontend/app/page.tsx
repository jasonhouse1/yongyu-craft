import { getWorks } from "@/lib/api";
import messages from "@/messages/zh.json";
import Link from "next/link";

export default async function HomePage() {
  const { items: works } = await getWorks({ limit: 3 }).catch(() => ({
    items: [],
  }));
  const t = messages;

  return (
    <main style={{ backgroundColor: "var(--yyc-bg)", minHeight: "100vh" }}>
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 50,
        padding: "1.5rem 3rem",
        display: "flex", justifyContent: "space-between", alignItems: "center",
        backgroundColor: "transparent",
      }}>
        <span style={{
          fontFamily: "var(--font-noto-serif-tc)",
          fontSize: "1rem",
          letterSpacing: "0.15em",
          color: "var(--yyc-ink)",
        }}>
          {t.nav.brand}
        </span>
        <div style={{ display: "flex", gap: "2.5rem" }}>
          {[
            { href: "/works", label: t.nav.works },
            { href: "/about", label: t.nav.about },
            { href: "/contact", label: t.nav.contact },
          ].map((item) => (
            <Link key={item.href} href={item.href} style={{
              fontSize: "0.8125rem",
              letterSpacing: "0.08em",
              color: "var(--yyc-ink)",
              opacity: 0.6,
            }}>
              {item.label}
            </Link>
          ))}
        </div>
      </nav>

      <section style={{
        height: "100vh",
        display: "flex", flexDirection: "column",
        justifyContent: "flex-end",
        padding: "0 3rem 5rem",
      }}>
        <div style={{ maxWidth: "36rem" }}>
          <p style={{
            fontSize: "0.75rem",
            letterSpacing: "0.2em",
            color: "var(--yyc-gold)",
            marginBottom: "1.5rem",
            textTransform: "uppercase",
          }}>
            {t.hero.tagline}
          </p>
          <h1 style={{
            fontFamily: "var(--font-noto-serif-tc)",
            fontSize: "clamp(2rem, 5vw, 3.5rem)",
            fontWeight: 300,
            lineHeight: 1.3,
            letterSpacing: "0.08em",
            color: "var(--yyc-ink)",
            marginBottom: "2rem",
          }}>
            {t.hero.line1}
            <br />
            {t.hero.line2}
          </h1>
          <Link href="/works" style={{
            display: "inline-flex", alignItems: "center", gap: "0.75rem",
            fontSize: "0.8125rem",
            letterSpacing: "0.12em",
            color: "var(--yyc-ink)",
            borderBottom: "1px solid var(--yyc-ink)",
            paddingBottom: "0.25rem",
          }}>
            {t.hero.cta}
          </Link>
        </div>
      </section>

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
