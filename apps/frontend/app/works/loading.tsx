export default function WorksLoading() {
  return (
    <main
      style={{
        backgroundColor: "#080706",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "1.25rem",
      }}
    >
      <style>{`
        @keyframes yyc-pulse {
          0%, 100% { opacity: 0.15; transform: scale(0.85); }
          50% { opacity: 0.8; transform: scale(1); }
        }
        .yyc-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background-color: #C49A5A;
          animation: yyc-pulse 1.4s ease-in-out infinite;
        }
        .yyc-dot:nth-child(2) { animation-delay: 0.2s; }
        .yyc-dot:nth-child(3) { animation-delay: 0.4s; }
      `}</style>
      <div style={{ display: "flex", gap: "0.625rem", alignItems: "center" }}>
        <div className="yyc-dot" />
        <div className="yyc-dot" />
        <div className="yyc-dot" />
      </div>
      <span style={{ fontSize: "0.7rem", color: "#6B6560", letterSpacing: "0.3em", fontWeight: 300 }}>
        載入中
      </span>
    </main>
  );
}
