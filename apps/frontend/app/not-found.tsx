import messages from "@/messages/zh.json";
import Link from "next/link";

export default function NotFound() {
  const t = messages;

  return (
    <main
      style={{
        backgroundColor: "#080706",
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
          fontFamily: "var(--font-noto-serif-tc)",
          fontSize: "8rem",
          fontWeight: 300,
          color: "#C49A5A",
          opacity: 0.3,
          lineHeight: 1,
          marginBottom: "2rem",
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
          color: "#E8ECF0",
          marginBottom: "1rem",
        }}
      >
        {t.notFound.title}
      </h1>
      <p
        style={{
          fontSize: "0.875rem",
          color: "#6B6560",
          letterSpacing: "0.05em",
          marginBottom: "3rem",
        }}
      >
        {t.notFound.message}
      </p>
      <div style={{ display: "flex", gap: "1.5rem", flexWrap: "wrap", justifyContent: "center" }}>
        <Link href="/" className="btn-cta-outline">
          {t.notFound.backHome}
        </Link>
        <Link href="/works" className="btn-cta-outline">
          {t.notFound.browseWorks}
        </Link>
      </div>
    </main>
  );
}
