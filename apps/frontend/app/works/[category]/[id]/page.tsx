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

      <div style={{ paddingTop: "6rem", padding: "6rem 3rem 0" }}>
        <nav
          aria-label="breadcrumb"
          style={{
            display: "flex",
            gap: "0.5rem",
            alignItems: "center",
            fontSize: "0.75rem",
            letterSpacing: "0.08em",
          }}
        >
          <Link href="/" style={{ color: "var(--yyc-sand)" }}>
            {t.works.breadcrumbHome}
          </Link>
          <span style={{ color: "var(--yyc-sand)", opacity: 0.5 }}>/</span>
          <Link href="/works" style={{ color: "var(--yyc-sand)" }}>
            {t.works.breadcrumbWorks}
          </Link>
          <span style={{ color: "var(--yyc-sand)", opacity: 0.5 }}>/</span>
          <span style={{ color: "var(--yyc-ink)" }}>{work.titleZh}</span>
        </nav>
      </div>

      <section
        style={{
          padding: "2.5rem 3rem 8rem",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: "4rem",
          maxWidth: "1100px",
        }}
      >
        <div>
          {hasImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={work.coverImage}
              alt={work.titleZh}
              style={{ width: "100%", height: "auto", display: "block" }}
            />
          ) : (
            <div
              style={{
                aspectRatio: "4/5",
                backgroundColor: "var(--yyc-sand)",
                opacity: 0.3,
              }}
            />
          )}
        </div>

        <div>
          <p
            style={{
              fontSize: "0.6875rem",
              letterSpacing: "0.15em",
              color: "var(--yyc-sand)",
              marginBottom: "0.75rem",
              textTransform: "uppercase",
            }}
          >
            {work.categoryId}
          </p>
          <h1
            style={{
              fontFamily: "var(--font-noto-serif-tc)",
              fontSize: "clamp(1.5rem, 3vw, 2rem)",
              fontWeight: 300,
              letterSpacing: "0.08em",
              color: "var(--yyc-ink)",
              marginBottom: "0.5rem",
            }}
          >
            {work.titleZh}
          </h1>
          {work.subtitleZh && (
            <p
              style={{
                fontSize: "0.9375rem",
                color: "var(--yyc-sand)",
                letterSpacing: "0.05em",
                marginBottom: "1.5rem",
              }}
            >
              {work.subtitleZh}
            </p>
          )}

          <div style={{ marginBottom: "2rem" }}>
            {work.priceType === "fixed" && work.price != null && (
              <p
                style={{
                  fontSize: "1.125rem",
                  color: "var(--yyc-gold)",
                  letterSpacing: "0.05em",
                }}
              >
                {t.works.pricePrefix} {work.price.toLocaleString()}
              </p>
            )}
            {work.priceType === "range" &&
              work.priceMin != null &&
              work.priceMax != null && (
                <p
                  style={{
                    fontSize: "1.125rem",
                    color: "var(--yyc-gold)",
                    letterSpacing: "0.05em",
                  }}
                >
                  {t.works.pricePrefix} {work.priceMin.toLocaleString()} –{" "}
                  {work.priceMax.toLocaleString()}
                </p>
              )}
            {work.priceType === "inquiry" && (
              <p
                style={{
                  fontSize: "0.9375rem",
                  color: "var(--yyc-sand)",
                  letterSpacing: "0.05em",
                }}
              >
                {t.works.inquiryLabel}
              </p>
            )}
          </div>

          <p
            style={{
              fontSize: "0.9375rem",
              color: "var(--yyc-ink)",
              lineHeight: 1.9,
              letterSpacing: "0.03em",
              marginBottom: "2rem",
              opacity: 0.85,
            }}
          >
            {work.descriptionZh}
          </p>

          <dl
            style={{
              marginBottom: "2rem",
              display: "flex",
              flexDirection: "column",
              gap: "0.75rem",
              borderTop: "1px solid var(--yyc-border)",
              paddingTop: "1.5rem",
            }}
          >
            {work.materials.length > 0 && (
              <div style={{ display: "flex", gap: "1.5rem" }}>
                <dt
                  style={{
                    fontSize: "0.6875rem",
                    letterSpacing: "0.12em",
                    color: "var(--yyc-sand)",
                    minWidth: "4rem",
                    flexShrink: 0,
                  }}
                >
                  {t.works.materials}
                </dt>
                <dd
                  style={{
                    fontSize: "0.875rem",
                    color: "var(--yyc-ink)",
                    opacity: 0.8,
                  }}
                >
                  {work.materials.join("、")}
                </dd>
              </div>
            )}
            {work.techniques.length > 0 && (
              <div style={{ display: "flex", gap: "1.5rem" }}>
                <dt
                  style={{
                    fontSize: "0.6875rem",
                    letterSpacing: "0.12em",
                    color: "var(--yyc-sand)",
                    minWidth: "4rem",
                    flexShrink: 0,
                  }}
                >
                  {t.works.techniques}
                </dt>
                <dd
                  style={{
                    fontSize: "0.875rem",
                    color: "var(--yyc-ink)",
                    opacity: 0.8,
                  }}
                >
                  {work.techniques.join("、")}
                </dd>
              </div>
            )}
            {work.dimensions && (
              <div style={{ display: "flex", gap: "1.5rem" }}>
                <dt
                  style={{
                    fontSize: "0.6875rem",
                    letterSpacing: "0.12em",
                    color: "var(--yyc-sand)",
                    minWidth: "4rem",
                    flexShrink: 0,
                  }}
                >
                  {t.works.dimensions}
                </dt>
                <dd
                  style={{
                    fontSize: "0.875rem",
                    color: "var(--yyc-ink)",
                    opacity: 0.8,
                  }}
                >
                  {work.dimensions}
                </dd>
              </div>
            )}
          </dl>

          {work.isCustomizable && (
            <div style={{ marginBottom: "2rem" }}>
              <span
                style={{
                  fontSize: "0.6875rem",
                  letterSpacing: "0.08em",
                  color: "var(--yyc-gold)",
                  border: "1px solid var(--yyc-gold)",
                  padding: "0.125rem 0.625rem",
                }}
              >
                {t.works.customizable}
              </span>
            </div>
          )}

          <div
            style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}
          >
            <Link
              href={`/inquiry?workId=${work.id}`}
              style={{
                display: "inline-flex",
                justifyContent: "center",
                alignItems: "center",
                padding: "0.875rem 2.5rem",
                backgroundColor: "var(--yyc-ink)",
                color: "var(--yyc-bg)",
                fontSize: "0.8125rem",
                letterSpacing: "0.12em",
              }}
            >
              {t.works.inquiryBtn}
            </Link>
            <Link
              href="/works"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
                fontSize: "0.75rem",
                letterSpacing: "0.1em",
                color: "var(--yyc-sand)",
              }}
            >
              ← {t.works.backToWorks}
            </Link>
          </div>
        </div>
      </section>

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
