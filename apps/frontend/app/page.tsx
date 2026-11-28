import { getWorks } from "@/lib/api";
import { categoryLabel } from "@/lib/categories";
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

      <section style={{ padding: "6rem 3rem", backgroundColor: "#080706" }}>
        <p style={{
          fontSize: "0.75rem",
          letterSpacing: "0.5em",
          color: "#C49A5A",
          marginBottom: "3rem",
          textTransform: "uppercase",
        }}>
          SELECTED WORKS
        </p>
        {works.length > 0 ? (
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
                <div className="works-card-thumb">
                  {work.coverImage ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img className="works-card-img" src={work.coverImage} alt={work.titleZh} />
                  ) : (
                    <div className="works-card-fallback">
                      <span>{work.titleZh[0]}</span>
                    </div>
                  )}
                  <div className="works-card-overlay">
                    <span style={{ color: "#E8ECF0", fontSize: "0.85rem", letterSpacing: "0.15em" }}>
                      查看作品 →
                    </span>
                  </div>
                </div>
                <p style={{
                  fontSize: "0.75rem",
                  letterSpacing: "0.12em",
                  color: "rgba(196,154,90,0.75)",
                  marginBottom: "0.5rem",
                }}>
                  {categoryLabel(work.categoryId)}
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
                    color: "#C49A5A",
                    marginTop: "0.5rem",
                    letterSpacing: "0.05em",
                  }}>
                    {t.works.pricePrefix} {work.price.toLocaleString()}
                  </p>
                )}
                {work.priceType === "inquiry" && (
                  <p style={{
                    fontSize: "0.8125rem",
                    color: "#B8B3AD",
                    marginTop: "0.5rem",
                    letterSpacing: "0.05em",
                  }}>
                    {t.works.inquiryLabel}
                  </p>
                )}
              </Link>
            ))}
          </div>
        ) : (
          <div style={{ paddingTop: "1rem", borderTop: "1px solid rgba(196,154,90,0.12)" }}>
            <p style={{
              fontFamily: "var(--font-noto-serif-tc)",
              fontSize: "1.25rem",
              color: "#F0EBE0",
              letterSpacing: "0.08em",
              marginTop: "2rem",
              marginBottom: "0.75rem",
            }}>
              精選作品即將呈現
            </p>
            <p style={{
              fontSize: "0.9375rem",
              color: "#B8B3AD",
              lineHeight: 1.8,
              marginBottom: "2rem",
              maxWidth: "42ch",
            }}>
              每一件手工金工作品都在細細打磨中。歡迎先瀏覽完整作品集，或與我們談談您心中的那一件。
            </p>
            <Link
              href="/works"
              className="nav-link-hero"
              style={{
                fontSize: "0.9rem",
                letterSpacing: "0.2em",
                color: "#C49A5A",
                textTransform: "uppercase",
              }}
            >
              瀏覽全部作品 →
            </Link>
          </div>
        )}
      </section>

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
          color: "rgba(196,154,90,0.85)",
        }}>
          {t.footer.brand}
        </span>
        <span style={{
          fontSize: "0.75rem",
          color: "#9A9590",
          letterSpacing: "0.05em",
        }}>
          {t.footer.copyright}
        </span>
      </footer>
    </main>
  );
}
