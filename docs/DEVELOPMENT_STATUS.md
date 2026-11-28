# 開發現況（DEVELOPMENT STATUS）

> 快照日期：2026-11-28。這份是「我們現在在哪」的共用現況，兩個 AI 動手前先看。
> 只記現況與待辦，不記空想功能。

## 技術棧

pnpm monorepo。前端 `apps/frontend`（Next.js 15 / React 19 / Tailwind 4，dev :3001）；
後端 `apps/backend`（Express 5 / Prisma 6 / PostgreSQL，dev :3000）。細節見 `CLAUDE.md`。

## 分支現況

- `main` — 基準分支。目前**落後** design 分支 13 個 commit（尚未含近期視覺成果）。
- `design/homepage-impeccable-polish` — 近期視覺/動畫工作在此，**超前 main 13 個 commit**：
  - 電影級「單戒指」首頁 hero（向量鑽戒開場 → 收斂成 logo lockup）。
  - Lumière 作品詳情頁頂部迴圈 hero 影片。
  - rembg 乾淨去背取代毛邊戒指切圖。
  - `apps/frontend/DESIGN.md`（設計系統）。
  → 待辦：由 ChatGPT 審查後決定併入 main（見下）。

## AI 協作制度（本階段建置）

- ✅ 檔案信箱 `docs/ai-bus/`（在 main）。
- ✅ 雲端 Claude Code Action workflow（PR #1）。**待生效**：需老闆 `/install-github-app` 裝 App + 設 `ANTHROPIC_API_KEY` secret。
- ✅ 治理與任務機制：`CLAUDE.md`、`AGENTS.md`、AI Task issue 模板、PR 模板（本 PR）。
- ⏳ ChatGPT GitHub 寫入權：待設定（見 `docs/ai-bus/FOR-CHATGPT.md`）。

## 已知缺口 / 待處理

- **CI 覆蓋不足**：`ci.yml` 只跑前後端 typecheck，**未**跑 lint、build、vitest 測試。
- **main 未設分支保護**：目前可直接推。要不要加「只能經 PR / 需審查」待老闆定（關係到「不在時自動工作」的安全邊界）。
- **後端安全性**：`server.ts` 有一段「dev 跳過 rate-limit」的本機改動尚未入庫；正式環境的 rate-limit / 安全性待 ChatGPT 盤點。
- 後端有 vitest 測試但 CI 未納入執行。

## 下一步

1. 老闆：`/install-github-app` + 設 secret → 合併 PR #1 → Action 生效。
2. ChatGPT：設好寫入權 → 回 `docs/ai-bus/messages/0001` → 審查 design→main 的 PR。
3. 第一個 `@claude` 自動任務實測（開含驗收條件的 AI Task issue）。
