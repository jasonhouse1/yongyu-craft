import messages from "@/messages/zh.json";
import Link from "next/link";

export default function AboutPage() {
  const t = messages;

  const values = [
    { title: t.about.value1, body: t.about.value1Body },
    { title: t.about.value2, body: t.about.value2Body },
    { title: t.about.value3, body: t.about.value3Body },
  ];

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
                opacity: item.href === "/about" ? 1 : 0.6,
              }}
            >
              {item.label}
            </Link>
          ))}
        </div>
      </nav>

      {/* Hero */}
      <section
        style={{
          paddingTop: "8rem",
          padding: "8rem 3rem 5rem",
          maxWidth: "720px",
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
          ABOUT
        </p>
        <h1
          style={{
            fontFamily: "var(--font-noto-serif-tc)",
            fontSize: "clamp(1.75rem, 4vw, 2.5rem)",
            fontWeight: 300,
            letterSpacing: "0.08em",
            color: "var(--yyc-ink)",
            marginBottom: "1rem",
          }}
        >
          {t.about.title}
        </h1>
        <p
          style={{
            fontSize: "1rem",
            color: "var(--yyc-sand)",
            letterSpacing: "0.08em",
            fontFamily: "var(--font-noto-serif-tc)",
            fontWeight: 300,
          }}
        >
          {t.about.subtitle}
        </p>
      </section>

      {/* Story */}
      <section
        style={{
          padding: "0 3rem 5rem",
          maxWidth: "720px",
          borderTop: "1px solid var(--yyc-border)",
          paddingTop: "3rem",
        }}
      >
        <p
          style={{
            fontSize: "0.6875rem",
            letterSpacing: "0.2em",
            color: "var(--yyc-gold)",
            marginBottom: "1.25rem",
            textTransform: "uppercase",
          }}
        >
          {t.about.story}
        </p>
        <p
          style={{
            fontSize: "0.9375rem",
            color: "var(--yyc-ink)",
            lineHeight: 2,
            letterSpacing: "0.05em",
            opacity: 0.85,
          }}
        >
          {t.about.storyBody}
        </p>
      </section>

      {/* Craftsmanship */}
      <section
        style={{
          padding: "3rem 3rem 5rem",
          maxWidth: "720px",
          borderTop: "1px solid var(--yyc-border)",
        }}
      >
        <p
          style={{
            fontSize: "0.6875rem",
            letterSpacing: "0.2em",
            color: "var(--yyc-gold)",
            marginBottom: "1.25rem",
            textTransform: "uppercase",
          }}
        >
          {t.about.craftsmanship}
        </p>
        <p
          style={{
            fontSize: "0.9375rem",
            color: "var(--yyc-ink)",
            lineHeight: 2,
            letterSpacing: "0.05em",
            opacity: 0.85,
          }}
        >
          {t.about.craftBody}
        </p>
      </section>

      {/* Values */}
      <section
        style={{
          padding: "3rem 3rem 8rem",
          borderTop: "1px solid var(--yyc-border)",
        }}
      >
        <p
          style={{
            fontSize: "0.6875rem",
            letterSpacing: "0.2em",
            color: "var(--yyc-gold)",
            marginBottom: "3rem",
            textTransform: "uppercase",
          }}
        >
          {t.about.values}
        </p>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "2.5rem",
          }}
        >
          {values.map((v, i) => (
            <div key={i}>
              <p
                style={{
                  fontFamily: "var(--font-noto-serif-tc)",
                  fontSize: "1rem",
                  fontWeight: 300,
                  letterSpacing: "0.08em",
                  color: "var(--yyc-ink)",
                  marginBottom: "0.75rem",
                }}
              >
                {v.title}
              </p>
              <p
                style={{
                  fontSize: "0.8125rem",
                  color: "var(--yyc-ink)",
                  lineHeight: 1.9,
                  letterSpacing: "0.03em",
                  opacity: 0.65,
                }}
              >
                {v.body}
              </p>
            </div>
          ))}
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
