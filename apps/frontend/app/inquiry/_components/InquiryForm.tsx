"use client";

import { useState } from "react";
import { submitInquiry } from "@/lib/api";
import messages from "@/messages/zh.json";
import Link from "next/link";

interface Props {
  workId?: string;
  workTitle?: string;
}

export default function InquiryForm({ workId, workTitle }: Props) {
  const t = messages;
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [inquiryType, setInquiryType] = useState(workId ? "artwork" : "custom");
  const [message, setMessage] = useState("");
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("submitting");
    try {
      await submitInquiry({ name, email, phone, inquiryType, workId, message });
      setStatus("success");
    } catch {
      setStatus("error");
    }
  };

  const fieldStyle = (id: string): React.CSSProperties => ({
    border: "none",
    borderBottom: `1px solid ${focusedField === id ? "#C49A5A" : "#3A3530"}`,
    background: "transparent",
    color: "#E8ECF0",
    padding: "16px 0",
    fontSize: "1rem",
    width: "100%",
    fontFamily: "var(--font-noto-sans-tc)",
    fontWeight: 300,
    letterSpacing: "0.03em",
    outline: "none",
    transition: "border-color 0.3s ease",
  });

  const labelStyle: React.CSSProperties = {
    display: "block",
    fontSize: "0.6875rem",
    letterSpacing: "0.18em",
    color: "#6B6560",
    marginBottom: "0",
    textTransform: "uppercase",
    fontWeight: 300,
  };

  if (status === "success") {
    return (
      <div style={{
        padding: "6rem 3rem 10rem",
        maxWidth: "560px",
        display: "flex",
        flexDirection: "column",
        gap: "1.5rem",
      }}>
        <div style={{
          width: "40px",
          height: "1px",
          backgroundColor: "#C49A5A",
        }} />
        <h2 style={{
          fontFamily: "var(--font-noto-serif-tc)",
          fontSize: "1.75rem",
          fontWeight: 300,
          letterSpacing: "0.1em",
          color: "#E8ECF0",
        }}>
          感謝您的信任
        </h2>
        <p style={{
          fontSize: "0.9375rem",
          color: "#6B6560",
          letterSpacing: "0.05em",
          lineHeight: 1.9,
        }}>
          師傅將在 48 小時內親自回覆您。
        </p>
        <Link
          href="/works"
          style={{
            marginTop: "1rem",
            fontSize: "0.75rem",
            letterSpacing: "0.15em",
            color: "rgba(196,154,90,0.6)",
          }}
        >
          ← {t.works.backToWorks}
        </Link>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        padding: "4rem 3rem 8rem",
        maxWidth: "560px",
        display: "flex",
        flexDirection: "column",
        gap: "3rem",
      }}
    >
      {/* Related work badge */}
      {workTitle && (
        <div style={{
          borderBottom: "1px solid rgba(196,154,90,0.15)",
          paddingBottom: "1rem",
          display: "flex",
          gap: "1rem",
          alignItems: "baseline",
        }}>
          <span style={{ fontSize: "0.6875rem", letterSpacing: "0.15em", color: "#6B6560" }}>
            {t.inquiry.relatedWork}
          </span>
          <span style={{ fontSize: "0.9375rem", color: "rgba(232,236,240,0.8)", letterSpacing: "0.03em" }}>
            {workTitle}
          </span>
        </div>
      )}

      {/* Name */}
      <div>
        <label htmlFor="f-name" style={labelStyle}>您的名字 *</label>
        <input
          id="f-name"
          type="text"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          onFocus={() => setFocusedField("f-name")}
          onBlur={() => setFocusedField(null)}
          style={fieldStyle("f-name")}
          autoComplete="name"
        />
      </div>

      {/* Email */}
      <div>
        <label htmlFor="f-email" style={labelStyle}>聯絡方式（Email）*</label>
        <input
          id="f-email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onFocus={() => setFocusedField("f-email")}
          onBlur={() => setFocusedField(null)}
          style={fieldStyle("f-email")}
          autoComplete="email"
        />
      </div>

      {/* Phone */}
      <div>
        <label htmlFor="f-phone" style={labelStyle}>電話（選填）</label>
        <input
          id="f-phone"
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          onFocus={() => setFocusedField("f-phone")}
          onBlur={() => setFocusedField(null)}
          style={fieldStyle("f-phone")}
          autoComplete="tel"
        />
      </div>

      {/* Inquiry type */}
      <div>
        <label htmlFor="f-type" style={labelStyle}>您對哪件作品感興趣</label>
        <select
          id="f-type"
          value={inquiryType}
          onChange={(e) => setInquiryType(e.target.value)}
          onFocus={() => setFocusedField("f-type")}
          onBlur={() => setFocusedField(null)}
          style={{
            ...fieldStyle("f-type"),
            appearance: "none",
            WebkitAppearance: "none",
          }}
        >
          {(Object.entries(t.inquiry.inquiryTypes) as [string, string][]).map(
            ([key, label]) => (
              <option key={key} value={key} style={{ backgroundColor: "#111010" }}>
                {label}
              </option>
            )
          )}
        </select>
      </div>

      {/* Message */}
      <div>
        <label htmlFor="f-message" style={labelStyle}>告訴我們您的故事 *</label>
        <textarea
          id="f-message"
          required
          rows={5}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onFocus={() => setFocusedField("f-message")}
          onBlur={() => setFocusedField(null)}
          placeholder="可以是一個場合、一段記憶、或是您心中的畫面⋯⋯"
          style={{
            ...fieldStyle("f-message"),
            resize: "vertical",
            paddingTop: "20px",
          }}
        />
      </div>

      {status === "error" && (
        <p style={{ fontSize: "0.8125rem", color: "#c0392b", letterSpacing: "0.03em" }}>
          {t.inquiry.errorMessage}
        </p>
      )}

      <button
        type="submit"
        disabled={status === "submitting"}
        className="btn-cta-outline"
        style={{
          alignSelf: "flex-start",
          opacity: status === "submitting" ? 0.5 : 1,
        }}
      >
        {status === "submitting" ? t.inquiry.submitting : "開始對話"}
      </button>
    </form>
  );
}
