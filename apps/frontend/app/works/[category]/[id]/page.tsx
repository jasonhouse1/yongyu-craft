import { getWork } from "@/lib/api";
import messages from "@/messages/zh.json";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function WorkDetailPage({
  params,
}: {
  params: Promise<{ category: string; id: string }>;
}) {
  const { id } = await params;
  const t = messages;

  const work = await getWork(id).catch(() => null);
  if (!work) notFound();

  const hasImage = work.coverImage && work.coverImage.length > 0;

  return (
    <main style={{ backgroundColor: "#080706" }}>

      {/* Fixed nav */}
      <nav style={{
        position: "fixed",
        top: 0, left: 0, right: 0,
        zIndex: 50,
        padding: "1.5rem 3rem",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: "rgba(8,7,6,0.75)",
        backdropFilter: "blur(12px)",
      }}>
        <Link href="/" style={{
          fontFamily: "var(--font-noto-serif-tc)",
          fontSize: "1rem",
          letterSpacing: "0.12em",
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

      {/* ── Section 1: Full-screen visual ── */}
      <section style={{
        position: "relative",
        height: "100vh",
        overflow: "hidden",
        display: "flex",
        alignItems: "flex-end",
      }}>
        {/* Background image */}
        {hasImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={work.coverImage}
            alt={work.titleZh}
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              zIndex: 0,
            }}
          />
        ) : (
          <div style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(135deg, rgba(196,154,90,0.08) 0%, #0D0D0B 100%)",
            zIndex: 0,
          }} />
        )}

        {/* Gradient overlay */}
        <div style={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(to top, rgba(8,7,6,0.95) 0%, rgba(8,7,6,0.4) 50%, rgba(8,7,6,0.1) 100%)",
          zIndex: 1,
        }} />

        {/* Title area */}
        <div style={{ position: "relative", zIndex: 2, padding: "0 3rem 5rem", maxWidth: "700px" }}>
          <p style={{
            fontSize: "0.6875rem",
            letterSpacing: "0.2em",
            color: "rgba(196,154,90,0.7)",
            textTransform: "uppercase",
            marginBottom: "1rem",
          }}>
            {work.categoryId}
          </p>
          <h1 style={{
            fontFamily: "var(--font-noto-serif-tc)",
            fontSize: "clamp(2.5rem, 6vw, 5rem)",
            fontWeight: 300,
            color: "#E8ECF0",
            letterSpacing: "0.06em",
            lineHeight: 1.2,
            marginBottom: "1rem",
          }}>
            {work.titleZh}
          </h1>
          {work.materials.length > 0 && (
            <p style={{
              fontSize: "0.875rem",
              color: "rgba(232,236,240,0.5)",
              letterSpacing: "0.12em",
            }}>
              {work.materials.join(" · ")}
            </p>
          )}
        </div>
      </section>

      {/* ── Section 2: Craft numbers ── */}
      <section style={{
        backgroundColor: "#111010",
        padding: "6rem 3rem",
        display: "flex",
        justifyContent: "center",
        gap: "0",
      }}>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "0",
          width: "100%",
          maxWidth: "900px",
          textAlign: "center",
        }}>
          {[
            {
              value: work.materials[0] ?? "精選材質",
              label: t.works.materials,
            },
            {
              value: work.techniques[0] ?? "傳統工法",
              label: t.works.techniques,
            },
            {
              value: work.techniques.length > 0
                ? `${work.techniques.length} 道`
                : "多道",
              label: "工序",
            },
          ].map((item, i) => (
            <div
              key={i}
              style={{
                padding: "2rem",
                borderRight: i < 2 ? "1px solid rgba(196,154,90,0.1)" : "none",
              }}
            >
              <p style={{
                fontFamily: "var(--font-noto-serif-tc)",
                fontSize: "clamp(2rem, 4vw, 5rem)",
                fontWeight: 300,
                color: "#E8ECF0",
                letterSpacing: "0.04em",
                marginBottom: "0.75rem",
                lineHeight: 1,
              }}>
                {item.value}
              </p>
              <p style={{
                fontSize: "0.8rem",
                letterSpacing: "0.18em",
                color: "#6B6560",
                textTransform: "uppercase",
              }}>
                {item.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Section 3: Story ── */}
      <section style={{
        padding: "8rem 3rem",
        display: "flex",
        gap: "4rem",
        maxWidth: "900px",
        margin: "0 auto",
      }}>
        {/* Gold vertical line */}
        <div style={{
          width: "1px",
          background: "linear-gradient(to bottom, transparent, #C49A5A 20%, #C49A5A 80%, transparent)",
          flexShrink: 0,
          opacity: 0.4,
          minHeight: "200px",
        }} />

        <div style={{ flex: 1 }}>
          <p style={{
            fontSize: "0.6875rem",
            letterSpacing: "0.2em",
            color: "rgba(196,154,90,0.5)",
            textTransform: "uppercase",
            marginBottom: "2rem",
          }}>
            STORY
          </p>
          <p style={{
            fontFamily: "var(--font-noto-serif-tc)",
            fontSize: "clamp(1.1rem, 1.8vw, 1.375rem)",
            fontWeight: 300,
            color: "rgba(232,236,240,0.8)",
            lineHeight: 2.2,
            letterSpacing: "0.06em",
            marginBottom: "3rem",
          }}>
            {work.descriptionZh}
          </p>

          {/* Specs */}
          {(work.dimensions || work.weight || work.year) && (
            <dl style={{
              display: "flex",
              flexDirection: "column",
              gap: "0.875rem",
              borderTop: "1px solid rgba(196,154,90,0.1)",
              paddingTop: "2rem",
            }}>
              {work.dimensions && (
                <div style={{ display: "flex", gap: "2rem" }}>
                  <dt style={{ fontSize: "0.6875rem", letterSpacing: "0.12em", color: "#6B6560", minWidth: "4rem" }}>
                    {t.works.dimensions}
                  </dt>
                  <dd style={{ fontSize: "0.875rem", color: "rgba(232,236,240,0.65)" }}>
                    {work.dimensions}
                  </dd>
                </div>
              )}
              {work.year && (
                <div style={{ display: "flex", gap: "2rem" }}>
                  <dt style={{ fontSize: "0.6875rem", letterSpacing: "0.12em", color: "#6B6560", minWidth: "4rem" }}>
                    {t.works.year}
                  </dt>
                  <dd style={{ fontSize: "0.875rem", color: "rgba(232,236,240,0.65)" }}>
                    {work.year}
                  </dd>
                </div>
              )}
            </dl>
          )}
        </div>
      </section>

      {/* ── Section 4: CTA ── */}
      <section style={{
        backgroundColor: "#080706",
        height: "80vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "2.5rem",
        textAlign: "center",
        padding: "0 3rem",
        borderTop: "1px solid rgba(196,154,90,0.06)",
      }}>
        <p style={{
          fontFamily: "var(--font-noto-serif-tc)",
          fontSize: "clamp(1.25rem, 2.5vw, 2rem)",
          fontWeight: 300,
          color: "rgba(232,236,240,0.7)",
          letterSpacing: "0.1em",
          lineHeight: 1.8,
        }}>
          這件作品，等待屬於它的主人
        </p>

        <Link href={`/inquiry?workId=${work.id}`} className="btn-cta-outline">
          開始對話
        </Link>

        <Link href="/works" style={{
          fontSize: "0.75rem",
          letterSpacing: "0.12em",
          color: "rgba(232,236,240,0.25)",
          marginTop: "1rem",
        }}>
          ← {t.works.backToWorks}
        </Link>
      </section>

      {/* Footer */}
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
