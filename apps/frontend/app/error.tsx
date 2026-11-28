"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log for debugging; never surface internals to the visitor.
    console.error(error);
  }, [error]);

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
          fontSize: "0.65rem",
          letterSpacing: "0.5em",
          color: "rgba(196,154,90,0.6)",
          textTransform: "uppercase",
          marginBottom: "2rem",
        }}
      >
        Something went wrong
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
        頁面暫時無法載入
      </h1>
      <p
        style={{
          fontSize: "0.875rem",
          color: "#A8A39D",
          letterSpacing: "0.05em",
          lineHeight: 1.8,
          marginBottom: "3rem",
          maxWidth: "38ch",
        }}
      >
        系統遇到了一點狀況。您可以重新載入，或先回到首頁稍後再試。
      </p>
      <div style={{ display: "flex", gap: "1.5rem", flexWrap: "wrap", justifyContent: "center" }}>
        <button type="button" onClick={reset} className="btn-cta-outline">
          重新載入
        </button>
        <Link href="/" className="btn-cta-outline">
          回到首頁
        </Link>
      </div>
    </main>
  );
}
