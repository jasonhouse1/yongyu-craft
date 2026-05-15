"use client";

import { useState } from "react";
import { submitInquiry } from "@/lib/api";
import messages from "@/messages/zh.json";
import Link from "next/link";

interface Props {
  workId?: string;
  workTitle?: string;
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "0.625rem 0.875rem",
  backgroundColor: "transparent",
  border: "1px solid var(--yyc-border)",
  color: "var(--yyc-ink)",
  fontSize: "0.875rem",
  letterSpacing: "0.03em",
  outline: "none",
  fontFamily: "var(--font-noto-sans-tc)",
};

const labelStyle: React.CSSProperties = {
  display: "block",
  fontSize: "0.6875rem",
  letterSpacing: "0.12em",
  color: "var(--yyc-sand)",
  marginBottom: "0.5rem",
};

export default function InquiryForm({ workId, workTitle }: Props) {
  const t = messages;

  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [inquiryType, setInquiryType] = useState("artwork");
  const [message, setMessage] = useState("");

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

  if (status === "success") {
    return (
      <div
        style={{
          padding: "5rem 3rem 8rem",
          maxWidth: "520px",
          textAlign: "center",
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
          ✓
        </p>
        <h2
          style={{
            fontFamily: "var(--font-noto-serif-tc)",
            fontSize: "1.5rem",
            fontWeight: 300,
            letterSpacing: "0.08em",
            color: "var(--yyc-ink)",
            marginBottom: "1rem",
          }}
        >
          {t.inquiry.successTitle}
        </h2>
        <p
          style={{
            fontSize: "0.9375rem",
            color: "var(--yyc-sand)",
            letterSpacing: "0.05em",
            marginBottom: "2.5rem",
          }}
        >
          {t.inquiry.successMessage}
        </p>
        <Link
          href="/works"
          style={{
            fontSize: "0.8125rem",
            letterSpacing: "0.1em",
            color: "var(--yyc-ink)",
            borderBottom: "1px solid var(--yyc-ink)",
            paddingBottom: "0.25rem",
          }}
        >
          {t.works.backToWorks}
        </Link>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        padding: "3rem 3rem 8rem",
        maxWidth: "520px",
        display: "flex",
        flexDirection: "column",
        gap: "1.75rem",
      }}
    >
      {workTitle && (
        <div
          style={{
            padding: "0.875rem 1rem",
            border: "1px solid var(--yyc-border)",
            display: "flex",
            gap: "1rem",
            alignItems: "center",
          }}
        >
          <span
            style={{
              fontSize: "0.6875rem",
              letterSpacing: "0.12em",
              color: "var(--yyc-sand)",
              flexShrink: 0,
            }}
          >
            {t.inquiry.relatedWork}
          </span>
          <span
            style={{
              fontSize: "0.875rem",
              color: "var(--yyc-ink)",
              letterSpacing: "0.03em",
            }}
          >
            {workTitle}
          </span>
        </div>
      )}

      <div>
        <label htmlFor="inquiry-name" style={labelStyle}>{t.inquiry.name} *</label>
        <input
          id="inquiry-name"
          type="text"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={inputStyle}
        />
      </div>

      <div>
        <label htmlFor="inquiry-email" style={labelStyle}>{t.inquiry.email} *</label>
        <input
          id="inquiry-email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={inputStyle}
        />
      </div>

      <div>
        <label htmlFor="inquiry-phone" style={labelStyle}>{t.inquiry.phone}</label>
        <input
          id="inquiry-phone"
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          style={inputStyle}
        />
      </div>

      <div>
        <label htmlFor="inquiry-type" style={labelStyle}>{t.inquiry.inquiryType}</label>
        <select
          id="inquiry-type"
          value={inquiryType}
          onChange={(e) => setInquiryType(e.target.value)}
          style={{ ...inputStyle, cursor: "pointer" }}
        >
          {(
            Object.entries(t.inquiry.inquiryTypes) as [string, string][]
          ).map(([key, label]) => (
            <option key={key} value={key}>
              {label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="inquiry-message" style={labelStyle}>{t.inquiry.message} *</label>
        <textarea
          id="inquiry-message"
          required
          rows={5}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          style={{ ...inputStyle, resize: "vertical" }}
        />
      </div>

      {status === "error" && (
        <p
          style={{
            fontSize: "0.8125rem",
            color: "#c0392b",
            letterSpacing: "0.03em",
          }}
        >
          {t.inquiry.errorMessage}
        </p>
      )}

      <button
        type="submit"
        disabled={status === "submitting"}
        style={{
          padding: "0.875rem 2.5rem",
          backgroundColor:
            status === "submitting" ? "var(--yyc-sand)" : "var(--yyc-ink)",
          color: "var(--yyc-bg)",
          fontSize: "0.8125rem",
          letterSpacing: "0.12em",
          border: "none",
          cursor: status === "submitting" ? "not-allowed" : "pointer",
          fontFamily: "var(--font-noto-sans-tc)",
          transition: "background-color 0.2s",
        }}
      >
        {status === "submitting" ? t.inquiry.submitting : t.inquiry.submit}
      </button>
    </form>
  );
}
