import messages from "@/messages/zh.json";
import Link from "next/link";

export default function AboutPage() {
  const t = messages;

  const values = [
    { title: t.about.value1, body: t.about.value1Body },
    { title: t.about.value2, body: t.about.value2Body },
    { title: t.about.value3, body: t.about.value3Body },
  ];

  const sectionLabel: React.CSSProperties = {
    fontSize: "0.75rem", letterSpacing: "0.2em", color: "#C49A5A",
    marginBottom: "1.25rem", textTransform: "uppercase",
  };

  const brandNumbers = [
    { num: "2010", label: "創立年份" },
    { num: "300+", label: "累計作品" },
    { num: "18", label: "製作工序" },
  ];

  return (
    <main style={{ backgroundColor: "#080706", minHeight: "100vh" }}>
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 50,
        padding: "1.5rem 3rem", display: "flex", justifyContent: "space-between", alignItems: "center",
        backgroundColor: "rgba(8,7,6,0.85)", backdropFilter: "blur(12px)",
        borderBottom: "1px solid rgba(196,154,90,0.08)",
      }}>
        <Link href="/" style={{ fontFamily: "var(--font-noto-serif-tc)", fontSize: "1rem", letterSpacing: "0.15em", color: "#C49A5A" }}>
          {t.nav.brand}
        </Link>
        <div style={{ display: "flex", gap: "2.5rem" }}>
          {[{ href: "/works", label: t.nav.works }, { href: "/about", label: t.nav.about }, { href: "/contact", label: t.nav.contact }].map(item => (
            <Link key={item.href} href={item.href} className="nav-link-hero"
              style={{ fontSize: "0.875rem", letterSpacing: "0.15em", color: "#C8C4BE", fontWeight: 300, opacity: item.href === "/about" ? 1 : 0.7 }}>
              {item.label}
            </Link>
          ))}
        </div>
      </nav>

      {/* Hero */}
      <section style={{ padding: "10rem 3rem 5rem", maxWidth: "720px" }}>
        <p style={{ fontSize: "0.75rem", letterSpacing: "0.5em", color: "#C49A5A", marginBottom: "0.75rem", textTransform: "uppercase" }}>
          CRAFTSMANSHIP · SINCE TAIWAN
        </p>
        <p style={{ fontSize: "0.75rem", letterSpacing: "0.2em", color: "#C49A5A", marginBottom: "1rem", textTransform: "uppercase" }}>
          ABOUT
        </p>
        <h1 style={{
          fontFamily: "var(--font-noto-serif-tc)", fontSize: "clamp(1.75rem, 4vw, 2.5rem)",
          fontWeight: 300, letterSpacing: "0.08em", color: "#E8ECF0", marginBottom: "1rem",
          borderLeft: "2px solid #C49A5A", paddingLeft: "1.25rem",
        }}>
          {t.about.title}
        </h1>
        <p style={{ fontSize: "1rem", color: "#A8A39D", letterSpacing: "0.08em", fontFamily: "var(--font-noto-serif-tc)", fontWeight: 300 }}>
          {t.about.subtitle}
        </p>
      </section>

      {/* Story + Numbers: two-column on desktop */}
      <section style={{ padding: "3rem 3rem 5rem", borderTop: "1px solid rgba(196,154,90,0.08)" }}>
        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr",
          gap: "4rem",
          alignItems: "start",
        }}
          className="about-two-col"
        >
          {/* Left: brand story */}
          <div>
            <p style={sectionLabel}>{t.about.story}</p>
            <p style={{ fontSize: "0.9375rem", color: "#E8ECF0", lineHeight: 2, letterSpacing: "0.05em", opacity: 0.85, marginBottom: "3rem" }}>
              {t.about.storyBody}
            </p>
            <p style={sectionLabel}>{t.about.craftsmanship}</p>
            <p style={{ fontSize: "0.9375rem", color: "#E8ECF0", lineHeight: 2, letterSpacing: "0.05em", opacity: 0.85 }}>
              {t.about.craftBody}
            </p>
          </div>

          {/* Right: brand numbers */}
          <div style={{ display: "flex", flexDirection: "column", gap: "2.5rem" }}>
            {brandNumbers.map((item) => (
              <div key={item.num} style={{ borderLeft: "1px solid rgba(196,154,90,0.25)", paddingLeft: "1.5rem" }}>
                <p style={{
                  fontFamily: "var(--font-noto-serif-tc)",
                  fontSize: "clamp(2.5rem, 5vw, 4rem)",
                  fontWeight: 300,
                  color: "#C49A5A",
                  letterSpacing: "0.04em",
                  lineHeight: 1,
                  marginBottom: "0.5rem",
                }}>
                  {item.num}
                </p>
                <p style={{ fontSize: "0.75rem", letterSpacing: "0.2em", color: "#A8A39D", textTransform: "uppercase" }}>
                  {item.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section style={{ padding: "3rem 3rem 8rem", borderTop: "1px solid rgba(196,154,90,0.08)" }}>
        <p style={sectionLabel}>{t.about.values}</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "2.5rem" }}>
          {values.map((v, i) => (
            <div key={i} style={{ borderLeft: "2px solid rgba(196,154,90,0.3)", paddingLeft: "1.25rem" }}>
              <p style={{ fontFamily: "var(--font-noto-serif-tc)", fontSize: "1rem", fontWeight: 300, letterSpacing: "0.08em", color: "#E8ECF0", marginBottom: "0.75rem" }}>
                {v.title}
              </p>
              <p style={{ fontSize: "0.8125rem", color: "#A8A39D", lineHeight: 1.9, letterSpacing: "0.03em" }}>
                {v.body}
              </p>
            </div>
          ))}
        </div>
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
