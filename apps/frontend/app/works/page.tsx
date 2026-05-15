import { getWorks } from "@/lib/api";
import messages from "@/messages/zh.json";
import Link from "next/link";

export default async function WorksPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;
  const t = messages;

  const { items: allWorks } = await getWorks({ limit: 100 }).catch(() => ({
    items: [],
  }));

  const categories = [...new Set(allWorks.map((w) => w.categoryId))];
  const works = category
    ? allWorks.filter((w) => w.categoryId === category)
    : allWorks;

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
                opacity: item.href === "/works" ? 1 : 0.6,
              }}
            >
              {item.label}
            </Link>
          ))}
        </div>
      </nav>

      <section
        style={{
          paddingTop: "8rem",
          padding: "8rem 3rem 3rem",
        }}
      >
        <p
          style={{
            fontSize: "0.75rem",
            letterSpacing: "0.2em",
            color: "var(--yyc-gold)",
            marginBottom: "1rem",
            textTransform: "uppercase",
          }}
        >
          CATALOGUE
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
          {t.works.pageTitle}
        </h1>
        <p
          style={{
            fontSize: "0.875rem",
            color: "var(--yyc-sand)",
            letterSpacing: "0.05em",
          }}
        >
          {t.works.pageSubtitle}
        </p>
      </section>

      {categories.length > 1 && (
        <div
          style={{
            padding: "2rem 3rem",
            display: "flex",
            gap: "0.25rem",
            flexWrap: "wrap",
            borderBottom: "1px solid var(--yyc-border)",
          }}
        >
          <Link
            href="/works"
            style={{
              fontSize: "0.8125rem",
              letterSpacing: "0.08em",
              color: "var(--yyc-ink)",
              padding: "0.375rem 1rem",
              border: "1px solid",
              borderColor: !category ? "var(--yyc-ink)" : "transparent",
              opacity: !category ? 1 : 0.45,
            }}
          >
            {t.works.filterAll}
          </Link>
          {categories.map((cat) => (
            <Link
              key={cat}
              href={`/works?category=${encodeURIComponent(cat)}`}
              style={{
                fontSize: "0.8125rem",
                letterSpacing: "0.08em",
                color: "var(--yyc-ink)",
                padding: "0.375rem 1rem",
                border: "1px solid",
                borderColor: category === cat ? "var(--yyc-ink)" : "transparent",
                opacity: category === cat ? 1 : 0.45,
              }}
            >
              {cat}
            </Link>
          ))}
        </div>
      )}

      <section style={{ padding: "3rem 3rem 8rem" }}>
        {works.length === 0 ? (
          <p
            style={{
              fontSize: "0.875rem",
              color: "var(--yyc-sand)",
              letterSpacing: "0.05em",
              padding: "4rem 0",
            }}
          >
            {t.works.noWorks}
          </p>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
              gap: "3.5rem 2rem",
            }}
          >
            {works.map((work) => (
              <Link
                key={work.id}
                href={`/works/${work.categoryId}/${work.id}`}
                style={{ display: "block" }}
              >
                <div
                  style={{
                    aspectRatio: "4/5",
                    backgroundColor: "var(--yyc-sand)",
                    opacity: 0.3,
                    marginBottom: "1.25rem",
                  }}
                />
                <p
                  style={{
                    fontSize: "0.6875rem",
                    letterSpacing: "0.15em",
                    color: "var(--yyc-sand)",
                    marginBottom: "0.5rem",
                    textTransform: "uppercase",
                  }}
                >
                  {work.categoryId}
                </p>
                <p
                  style={{
                    fontSize: "0.9375rem",
                    letterSpacing: "0.05em",
                    color: "var(--yyc-ink)",
                    marginBottom: "0.5rem",
                  }}
                >
                  {work.titleZh}
                </p>
                {work.priceType === "fixed" && work.price != null && (
                  <p
                    style={{
                      fontSize: "0.8125rem",
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
                        fontSize: "0.8125rem",
                        color: "var(--yyc-gold)",
                        letterSpacing: "0.05em",
                      }}
                    >
                      {t.works.pricePrefix} {work.priceMin.toLocaleString()} – {work.priceMax.toLocaleString()}
                    </p>
                  )}
                {work.priceType === "inquiry" && (
                  <p
                    style={{
                      fontSize: "0.8125rem",
                      color: "var(--yyc-sand)",
                      letterSpacing: "0.05em",
                    }}
                  >
                    {t.works.inquiryLabel}
                  </p>
                )}
                <div
                  style={{
                    display: "flex",
                    gap: "0.75rem",
                    marginTop: "0.625rem",
                    flexWrap: "wrap",
                  }}
                >
                  {work.isCustomizable && (
                    <span
                      style={{
                        fontSize: "0.6875rem",
                        letterSpacing: "0.08em",
                        color: "var(--yyc-gold)",
                        border: "1px solid var(--yyc-gold)",
                        padding: "0.125rem 0.5rem",
                      }}
                    >
                      {t.works.customizable}
                    </span>
                  )}
                  {!work.isAvailable && (
                    <span
                      style={{
                        fontSize: "0.6875rem",
                        letterSpacing: "0.08em",
                        color: "var(--yyc-sand)",
                        border: "1px solid var(--yyc-sand)",
                        padding: "0.125rem 0.5rem",
                      }}
                    >
                      {t.works.notAvailable}
                    </span>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
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
