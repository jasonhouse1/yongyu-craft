import messages from "@/messages/zh.json";
import Link from "next/link";

export default function NotFound() {
  const t = messages;

  return (
    <main
      style={{
        backgroundColor: "var(--yyc-bg)",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "3rem",
        textAlign: "center",
      }}
    >
      <p
        style={{
          fontSize: "0.75rem",
          letterSpacing: "0.3em",
          color: "var(--yyc-gold)",
          marginBottom: "1.5rem",
          textTransform: "uppercase",
        }}
      >
        404
      </p>
      <h1
        style={{
          fontFamily: "var(--font-noto-serif-tc)",
          fontSize: "clamp(1.5rem, 4vw, 2.25rem)",
          fontWeight: 300,
          letterSpacing: "0.1em",
          color: "var(--yyc-ink)",
          marginBottom: "1rem",
        }}
      >
        {t.notFound.title}
      </h1>
      <p
        style={{
          fontSize: "0.875rem",
          color: "var(--yyc-sand)",
          letterSpacing: "0.05em",
          marginBottom: "3rem",
        }}
      >
        {t.notFound.message}
      </p>
      <div style={{ display: "flex", gap: "1.5rem", flexWrap: "wrap", justifyContent: "center" }}>
        <Link
          href="/"
          style={{
            display: "inline-flex",
            alignItems: "center",
            padding: "0.75rem 2rem",
            backgroundColor: "var(--yyc-ink)",
            color: "var(--yyc-bg)",
            fontSize: "0.8125rem",
            letterSpacing: "0.12em",
          }}
        >
          {t.notFound.backHome}
        </Link>
        <Link
          href="/works"
          style={{
            display: "inline-flex",
            alignItems: "center",
            padding: "0.75rem 2rem",
            border: "1px solid var(--yyc-ink)",
            color: "var(--yyc-ink)",
            fontSize: "0.8125rem",
            letterSpacing: "0.12em",
          }}
        >
          {t.notFound.browseWorks}
        </Link>
      </div>
    </main>
  );
}
