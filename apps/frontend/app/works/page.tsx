import { getWorks } from "@/lib/api";
import messages from "@/messages/zh.json";
import Link from "next/link";
import WorksGallery from "@/components/works/WorksGallery";

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
    <main style={{ backgroundColor: "#080706", minHeight: "100vh" }}>
      {/* Nav */}
      <nav
        style={{
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
        }}
      >
        <Link
          href="/"
          style={{
            fontFamily: "var(--font-noto-serif-tc)",
            fontSize: "1rem",
            letterSpacing: "0.15em",
            color: "#C49A5A",
          }}
        >
          YY
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
                fontSize: "0.75rem",
                letterSpacing: "0.15em",
                color: item.href === "/works"
                  ? "rgba(196,154,90,0.9)"
                  : "rgba(232,236,240,0.4)",
                fontWeight: 300,
              }}
            >
              {item.label}
            </Link>
          ))}
        </div>
      </nav>

      {/* Header */}
      <section style={{ padding: "10rem 3rem 4rem" }}>
        <p style={{
          fontSize: "0.6875rem",
          letterSpacing: "0.25em",
          color: "rgba(196,154,90,0.5)",
          marginBottom: "1rem",
          textTransform: "uppercase",
        }}>
          CATALOGUE
        </p>
        <h1 style={{
          fontFamily: "var(--font-noto-serif-tc)",
          fontSize: "clamp(1.75rem, 4vw, 2.5rem)",
          fontWeight: 300,
          letterSpacing: "0.08em",
          color: "#E8ECF0",
          marginBottom: "0.75rem",
        }}>
          {t.works.pageTitle}
        </h1>
        <p style={{ fontSize: "0.875rem", color: "#6B6560", letterSpacing: "0.05em" }}>
          {t.works.pageSubtitle}
        </p>
      </section>

      {/* Category filter */}
      {categories.length > 1 && (
        <div style={{
          padding: "0 3rem 3rem",
          display: "flex",
          gap: "0.5rem",
          flexWrap: "wrap",
          borderBottom: "1px solid rgba(196,154,90,0.08)",
          marginBottom: "6rem",
        }}>
          <Link
            href="/works"
            style={{
              fontSize: "0.75rem",
              letterSpacing: "0.1em",
              color: !category ? "#C49A5A" : "rgba(232,236,240,0.35)",
              padding: "0.375rem 1.25rem",
              border: "1px solid",
              borderColor: !category ? "rgba(196,154,90,0.4)" : "rgba(196,154,90,0.1)",
              fontWeight: 300,
            }}
          >
            {t.works.filterAll}
          </Link>
          {categories.map((cat) => (
            <Link
              key={cat}
              href={`/works?category=${encodeURIComponent(cat)}`}
              style={{
                fontSize: "0.75rem",
                letterSpacing: "0.1em",
                color: category === cat ? "#C49A5A" : "rgba(232,236,240,0.35)",
                padding: "0.375rem 1.25rem",
                border: "1px solid",
                borderColor: category === cat ? "rgba(196,154,90,0.4)" : "rgba(196,154,90,0.1)",
                fontWeight: 300,
              }}
            >
              {cat}
            </Link>
          ))}
        </div>
      )}

      {/* Gallery */}
      <div style={{ padding: "0 3rem 8rem" }}>
        <WorksGallery works={works} />
      </div>

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
