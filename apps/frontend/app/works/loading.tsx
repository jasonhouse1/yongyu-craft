export default function WorksLoading() {
  return (
    <main
      style={{
        backgroundColor: "var(--yyc-bg)",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <style>{`
        @keyframes yyc-pulse {
          0%, 100% { opacity: 0.15; transform: scale(0.85); }
          50% { opacity: 0.6; transform: scale(1); }
        }
        .yyc-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background-color: var(--yyc-sand);
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
    </main>
  );
}
