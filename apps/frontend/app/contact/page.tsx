import messages from "@/messages/zh.json";
import Link from "next/link";

export default function ContactPage() {
  const t = messages;

  const channels = [
    { label: t.contact.email, value: t.contact.emailValue, href: `mailto:${t.contact.emailValue}` },
    { label: t.contact.line, value: t.contact.lineValue, href: null },
    { label: t.contact.whatsapp, value: t.contact.whatsappValue, href: `https://wa.me/${t.contact.whatsappValue.replace(/\D/g, "")}` },
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
                opacity: item.href === "/contact" ? 1 : 0.6,
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
          padding: "8rem 3rem 4rem",
          maxWidth: "600px",
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
          CONTACT
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
          {t.contact.title}
        </h1>
        <p
          style={{
            fontSize: "0.875rem",
            color: "var(--yyc-sand)",
            letterSpacing: "0.05em",
          }}
        >
          {t.contact.subtitle}
        </p>
      </section>

      <section
        style={{
          padding: "0 3rem 6rem",
          maxWidth: "480px",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "0",
            borderTop: "1px solid var(--yyc-border)",
          }}
        >
          {channels.map((ch) => (
            <div
              key={ch.label}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "1.5rem 0",
                borderBottom: "1px solid var(--yyc-border)",
              }}
            >
              <span
                style={{
                  fontSize: "0.6875rem",
                  letterSpacing: "0.15em",
                  color: "var(--yyc-sand)",
                  textTransform: "uppercase",
                  minWidth: "6rem",
                }}
              >
                {ch.label}
              </span>
              {ch.href ? (
                <a
                  href={ch.href}
                  style={{
                    fontSize: "0.9375rem",
                    color: "var(--yyc-ink)",
                    letterSpacing: "0.03em",
                  }}
                >
                  {ch.value}
                </a>
              ) : (
                <span
                  style={{
                    fontSize: "0.9375rem",
                    color: "var(--yyc-ink)",
                    letterSpacing: "0.03em",
                  }}
                >
                  {ch.value}
                </span>
              )}
            </div>
          ))}
        </div>

        <div style={{ marginTop: "3rem" }}>
          <p
            style={{
              fontSize: "0.75rem",
              letterSpacing: "0.12em",
              color: "var(--yyc-sand)",
              marginBottom: "1.25rem",
            }}
          >
            {t.contact.or}
          </p>
          <Link
            href="/inquiry"
            style={{
              display: "inline-flex",
              alignItems: "center",
              padding: "0.875rem 2.5rem",
              backgroundColor: "var(--yyc-ink)",
              color: "var(--yyc-bg)",
              fontSize: "0.8125rem",
              letterSpacing: "0.12em",
            }}
          >
            {t.contact.inquiryBtn}
          </Link>
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
