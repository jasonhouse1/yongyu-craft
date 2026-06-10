import { getWork } from "@/lib/api";
import messages from "@/messages/zh.json";
import Link from "next/link";
import { notFound } from "next/navigation";
import BackButton from "@/components/ui/BackButton";
import FavoriteButton from "@/components/ui/FavoriteButton";

export default async function WorkDetailPage({
  params,
}: {
  params: Promise<{ category: string; id: string }>;
}) {
  const { id, category } = await params;
  const t = messages;

  const work = await getWork(id).catch(() => null);
  if (!work) notFound();

  const hasImage = !!work.coverImage;
  const material = work.materials[0] ?? "精選材質";
  const technique = work.techniques[0] ?? "傳統工法";
  const processCount = work.techniques.length > 0 ? `${work.techniques.length} 道` : "多道";

  return (
    <main style={{ backgroundColor: "#080706" }}>

      {/* Fixed nav */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 50,
        padding: "1.5rem 3rem",
        display: "flex", justifyContent: "space-between", alignItems: "center",
        backgroundColor: "rgba(8,7,6,0.75)", backdropFilter: "blur(12px)",
      }}>
        <Link href="/" style={{ fontFamily: "var(--font-noto-serif-tc)", fontSize: "1rem", letterSpacing: "0.12em", color: "#C49A5A" }}>
          YY
        </Link>
        <div style={{ display: "flex", gap: "2.5rem", alignItems: "center" }}>
          {[{ href: "/works", label: t.nav.works }, { href: "/about", label: t.nav.about }, { href: "/contact", label: t.nav.contact }].map(item => (
            <Link key={item.href} href={item.href} style={{ fontSize: "0.75rem", letterSpacing: "0.15em", color: "rgba(232,236,240,0.4)", fontWeight: 300 }}>
              {item.label}
            </Link>
          ))}
          <FavoriteButton workId={work.id} categoryId={category} />
        </div>
      </nav>

      {/* ── Section 1: Full-screen hero ── */}
      <section style={{ position: "relative", height: "100vh", overflow: "hidden", display: "flex", alignItems: "flex-end" }}>
        {hasImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={work.coverImage} alt={work.titleZh}
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", zIndex: 0 }} />
        ) : (
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, rgba(196,154,90,0.08) 0%, #0D0D0B 100%)", zIndex: 0 }} />
        )}
        <div style={{
          position: "absolute", inset: 0, zIndex: 1,
          background: "linear-gradient(to top, #080706 30%, transparent 70%)",
        }} />
        <div style={{ position: "relative", zIndex: 2, padding: "0 3rem 5rem", maxWidth: "700px" }}>
          <div style={{ marginBottom: "1.5rem" }}><BackButton /></div>
          <p style={{ fontSize: "0.6875rem", letterSpacing: "0.2em", color: "rgba(196,154,90,0.7)", textTransform: "uppercase", marginBottom: "1rem" }}>
            {work.categoryId}
          </p>
          <h1 style={{
            fontFamily: "var(--font-noto-serif-tc)", fontWeight: 300, color: "#E8ECF0",
            fontSize: "clamp(2.5rem, 5vw, 5rem)", letterSpacing: "0.06em", lineHeight: 1.2, marginBottom: "0.75rem",
          }}>
            {work.titleZh}
          </h1>
          {work.subtitleZh && (
            <p style={{ fontSize: "0.9375rem", color: "#9A9590", letterSpacing: "0.1em", fontWeight: 300 }}>
              {work.subtitleZh}
            </p>
          )}
        </div>
      </section>

      {/* ── Section 2: Craft numbers ── */}
      <section style={{ backgroundColor: "#080706", padding: "6rem 3rem" }}>
        <div style={{ maxWidth: "900px", margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 0 }}>
          {[
            { value: material, label: t.works.materials },
            { value: technique, label: t.works.techniques },
            { value: processCount, label: "工序" },
          ].map((item, i) => (
            <div key={i} style={{
              padding: "2.5rem 2rem",
              borderLeft: i === 0 ? "2px solid #C49A5A" : "none",
              borderRight: i < 2 ? "1px solid rgba(196,154,90,0.1)" : "none",
            }}>
              <p style={{
                fontFamily: "var(--font-noto-serif-tc)", fontSize: "3rem", fontWeight: 300,
                color: "#E8ECF0", letterSpacing: "0.04em", marginBottom: "0.75rem", lineHeight: 1,
              }}>
                {item.value}
              </p>
              <p style={{ fontSize: "0.8rem", letterSpacing: "0.18em", color: "#9A9590", textTransform: "uppercase" }}>
                {item.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Section 3: Story ── */}
      <section style={{ backgroundColor: "#0D0C0B", padding: "8rem 3rem" }}>
        <div style={{ maxWidth: "720px", margin: "0 auto" }}>
          <p style={{ fontSize: "0.65rem", letterSpacing: "0.5em", color: "#C49A5A", textTransform: "uppercase", marginBottom: "3rem" }}>
            STORY
          </p>
          {work.descriptionZh && (
            <p style={{
              fontFamily: "var(--font-noto-serif-tc)", fontWeight: 300, color: "rgba(232,236,240,0.85)",
              fontSize: "clamp(1rem, 2vw, 1.4rem)", lineHeight: 2.2, letterSpacing: "0.06em", marginBottom: "2.5rem",
            }}>
              {work.descriptionZh}
            </p>
          )}
          {work.storyZh && (
            <p style={{
              fontStyle: "italic", color: "#9A9590",
              fontSize: "clamp(0.875rem, 1.5vw, 1.1rem)", lineHeight: 2, letterSpacing: "0.04em",
              borderLeft: "2px solid rgba(196,154,90,0.3)", paddingLeft: "1.5rem",
            }}>
              {work.storyZh}
            </p>
          )}
          {(work.dimensions || work.year) && (
            <dl style={{ marginTop: "3rem", display: "flex", flexDirection: "column", gap: "0.875rem", borderTop: "1px solid rgba(196,154,90,0.1)", paddingTop: "2rem" }}>
              {work.dimensions && (
                <div style={{ display: "flex", gap: "2rem" }}>
                  <dt style={{ fontSize: "0.6875rem", letterSpacing: "0.12em", color: "#6B6560", minWidth: "4rem" }}>{t.works.dimensions}</dt>
                  <dd style={{ fontSize: "0.875rem", color: "rgba(232,236,240,0.65)" }}>{work.dimensions}</dd>
                </div>
              )}
              {work.year && (
                <div style={{ display: "flex", gap: "2rem" }}>
                  <dt style={{ fontSize: "0.6875rem", letterSpacing: "0.12em", color: "#6B6560", minWidth: "4rem" }}>{t.works.year}</dt>
                  <dd style={{ fontSize: "0.875rem", color: "rgba(232,236,240,0.65)" }}>{work.year}</dd>
                </div>
              )}
            </dl>
          )}
        </div>
      </section>

      {/* ── Section 4: CTA ── */}
      <section style={{
        backgroundColor: "#080706", minHeight: "80vh",
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
        gap: "2.5rem", textAlign: "center", padding: "0 3rem",
        borderTop: "1px solid rgba(196,154,90,0.06)", position: "relative",
      }}>
        <p style={{
          fontFamily: "var(--font-noto-serif-tc)", fontWeight: 300, color: "#E8ECF0",
          fontSize: "clamp(1.2rem, 3vw, 2rem)", letterSpacing: "0.1em", lineHeight: 1.8,
        }}>
          這件作品，等待屬於它的主人
        </p>
        <Link href={`/inquiry?work=${encodeURIComponent(work.titleZh)}`} className="btn-cta-outline">
          開始對話
        </Link>
        <Link href="/works" style={{
          position: "absolute", bottom: "3rem", left: "3rem",
          fontSize: "0.75rem", letterSpacing: "0.12em", color: "rgba(232,236,240,0.25)",
        }}>
          ← {t.works.backToWorks}
        </Link>
      </section>

      <footer style={{
        backgroundColor: "#0D0D0B", padding: "3rem",
        display: "flex", justifyContent: "space-between", alignItems: "center",
        flexWrap: "wrap", gap: "1rem", borderTop: "1px solid rgba(196,154,90,0.08)",
      }}>
        <span style={{ fontFamily: "var(--font-noto-serif-tc)", fontSize: "0.875rem", letterSpacing: "0.12em", color: "rgba(196,154,90,0.55)" }}>
          {t.footer.brand}
        </span>
        <span style={{ fontSize: "0.75rem", color: "rgba(232,236,240,0.18)", letterSpacing: "0.05em" }}>
          {t.footer.copyright}
        </span>
      </footer>
    </main>
  );
}
