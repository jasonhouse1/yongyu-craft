import { getWorks } from "@/lib/api";
import messages from "@/messages/zh.json";
import Link from "next/link";
import RingHero from "@/components/hero/RingHero";
import CraftSection from "@/components/hero/CraftSection";

export default async function HomePage() {
  const { items: works } = await getWorks({ limit: 3 }).catch(() => ({
    items: [],
  }));
  const t = messages;

  return (
    <main style={{ backgroundColor: "#080706" }}>
      <RingHero />
      <CraftSection />

      {works.length > 0 && (
        <section style={{ padding: "6rem 3rem", backgroundColor: "#080706" }}>
          <p style={{
            fontSize: "0.7rem",
            letterSpacing: "0.5em",
            color: "#C49A5A",
            marginBottom: "3rem",
            textTransform: "uppercase",
          }}>
            SELECTED WORKS
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
                  backgroundColor: "rgba(184,150,90,0.06)",
                  border: "1px solid rgba(184,150,90,0.1)",
                  marginBottom: "1.25rem",
                  position: "relative",
                  overflow: "hidden",
                }}>
                  <div
                    className="works-hover-overlay"
                    style={{
                      position: "absolute",
                      inset: 0,
                      background: "rgba(0,0,0,0.55)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      opacity: 0,
                      transition: "opacity 0.3s ease",
                    }}
                    onMouseEnter={e => (e.currentTarget.style.opacity = "1")}
                    onMouseLeave={e => (e.currentTarget.style.opacity = "0")}
                  >
                    <span style={{ color: "#E8ECF0", fontSize: "0.85rem", letterSpacing: "0.15em" }}>
                      查看作品 →
                    </span>
                  </div>
                </div>
                <p style={{
                  fontSize: "0.75rem",
                  letterSpacing: "0.12em",
                  color: "rgba(184,150,90,0.5)",
                  marginBottom: "0.5rem",
                }}>
                  {work.categoryId}
                </p>
                <p style={{
                  fontSize: "0.9375rem",
                  letterSpacing: "0.05em",
                  color: "#E8ECF0",
                }}>
                  {work.titleZh}
                </p>
                {work.priceType === "fixed" && work.price && (
                  <p style={{
                    fontSize: "0.8125rem",
                    color: "#B8965A",
                    marginTop: "0.5rem",
                    letterSpacing: "0.05em",
                  }}>
                    {t.works.pricePrefix} {work.price.toLocaleString()}
                  </p>
                )}
                {work.priceType === "inquiry" && (
                  <p style={{
                    fontSize: "0.8125rem",
                    color: "rgba(255,255,255,0.3)",
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
        backgroundColor: "#0D0D0B",
        padding: "3rem",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
        gap: "1rem",
        borderTop: "1px solid rgba(184,150,90,0.08)",
      }}>
        <span style={{
          fontFamily: "var(--font-noto-serif-tc)",
          fontSize: "0.875rem",
          letterSpacing: "0.12em",
          color: "rgba(184,150,90,0.6)",
        }}>
          {t.footer.brand}
        </span>
        <span style={{
          fontSize: "0.75rem",
          color: "rgba(255,255,255,0.18)",
          letterSpacing: "0.05em",
        }}>
          {t.footer.copyright}
        </span>
      </footer>
    </main>
  );
}
