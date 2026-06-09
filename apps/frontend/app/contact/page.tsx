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
              style={{ fontSize: "0.8rem", letterSpacing: "0.15em", color: "#C8C4BE", fontWeight: 300, opacity: item.href === "/contact" ? 1 : 0.7 }}>
              {item.label}
            </Link>
          ))}
        </div>
      </nav>

      <section style={{ padding: "10rem 3rem 4rem", maxWidth: "600px" }}>
        <p style={{ fontSize: "0.75rem", letterSpacing: "0.2em", color: "#C49A5A", marginBottom: "1rem", textTransform: "uppercase" }}>
          CONTACT
        </p>
        <h1 style={{
          fontFamily: "var(--font-noto-serif-tc)", fontSize: "clamp(1.75rem, 4vw, 2.5rem)",
          fontWeight: 300, letterSpacing: "0.08em", color: "#E8ECF0", marginBottom: "1rem",
          borderLeft: "2px solid #C49A5A", paddingLeft: "1.25rem",
        }}>
          {t.contact.title}
        </h1>
        <p style={{ fontSize: "0.875rem", color: "#9A9590", letterSpacing: "0.05em" }}>
          {t.contact.subtitle}
        </p>
      </section>

      <section style={{ padding: "0 3rem 6rem", maxWidth: "480px" }}>
        <div style={{ display: "flex", flexDirection: "column", borderTop: "1px solid rgba(196,154,90,0.08)" }}>
          {channels.map(ch => (
            <div key={ch.label} className="contact-channel" style={{
              display: "flex", justifyContent: "space-between", alignItems: "center",
              padding: "1.5rem 0", borderBottom: "1px solid rgba(196,154,90,0.08)",
              transition: "border-color 0.3s ease",
            }}>
              <span style={{ fontSize: "0.6875rem", letterSpacing: "0.15em", color: "#6B6560", textTransform: "uppercase", minWidth: "6rem" }}>
                {ch.label}
              </span>
              {ch.href ? (
                <a href={ch.href} style={{ fontSize: "0.9375rem", color: "#E8ECF0", letterSpacing: "0.03em" }}>
                  {ch.value}
                </a>
              ) : (
                <span style={{ fontSize: "0.9375rem", color: "#E8ECF0", letterSpacing: "0.03em" }}>{ch.value}</span>
              )}
            </div>
          ))}
        </div>

        <div style={{ marginTop: "3rem" }}>
          <p style={{ fontSize: "0.75rem", letterSpacing: "0.12em", color: "#9A9590", marginBottom: "1.25rem" }}>
            {t.contact.or}
          </p>
          <Link href="/inquiry" className="btn-cta-outline">
            {t.contact.inquiryBtn}
          </Link>
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
