# CLAUDE.md — 永裕工藝 開發指引（本地 Claude Code 與雲端 Claude Code Action 共用）

> 這份檔案會被 Claude 自動載入當作專案脈絡。雲端的 Claude Code Action 也讀它。
> 它的修改屬「PO 核准」類別——要經老闆同意、走 PR，不得任一 AI 單方面推。

## 這是什麼

永裕工藝（手工金工珠寶）電商網站。pnpm monorepo。

- `apps/frontend` — Next.js 15 / React 19 / Tailwind 4。前端網站 + 後台 admin。
- `apps/backend` — Express 5 / Prisma 6 / PostgreSQL。API、認證、詢價、email。
- 設計系統文件：`apps/frontend/DESIGN.md`（設計真相以它＋程式碼＋Figma 為準，勿另開重複文件）。
- AI 協作制度：`docs/ai-bus/`（ChatGPT⇄Claude 信箱）、`AGENTS.md`（共用規範）。

## 指令（在 repo 根目錄）

| 做什麼 | 指令 |
|---|---|
| 安裝 | `pnpm install`（或各 app `cd apps/<app> && pnpm install`） |
| 前端開發 | `pnpm dev:frontend` → http://localhost:**3001** |
| 後端開發 | `pnpm dev:backend` → http://localhost:**3000** |
| 前端型別檢查 | `pnpm --filter frontend typecheck`（= `tsc --noEmit`） |
| 後端型別檢查 | `pnpm --filter backend typecheck` |
| 前端 lint | `pnpm --filter frontend lint`（`next lint`） |
| 後端測試 | `pnpm --filter backend test`（vitest） |
| 資料庫 | `pnpm db:migrate` / `db:seed` / `db:studio`（**破壞性，見下**） |

Node ≥ 20、pnpm ≥ 9。

## CI（目前）

`.github/workflows/ci.yml`：對 main 的 push / PR 跑六個 job——後端 **backend-typecheck、backend-test（vitest，目前零測試用 `--passWithNoTests` 綠）、backend-build**；前端 **frontend-typecheck、frontend-lint、frontend-build**。後端的 typecheck/test/build 都會先 `pnpm db:generate` 生成 Prisma client；前端 build（`next build`）在無後端時靠 server component 的 `.catch` 降級仍可完成。
→ 送 PR 前，本地至少把你動到的那個 app 的 `typecheck` 跑過（有改前端就連 `lint` 一起）。

## 慣例

- TypeScript strict。前端 Server Components 優先；需互動才 `"use client"`。
- 動畫：framer-motion（SSR 要用 mount-gate 避免 hydration 不一致）。
- Commit：Conventional Commits（`feat:` `fix:` `ci:` `chore:` `docs:` …）。訊息可中英。
- **Commit 署名：目前依老闆要求，不加 `Co-Authored-By: Claude` 之類協作署名**（PO 的決定，要改由 PO 說）。
- 分支：短命 feature branch → PR → 審查 → 由老闆決定併 main。**不直接推 main。**

## 護欄（硬規則）

- **絕不** commit 密鑰：`.env`、token、密碼、完整 DB 連線字串。發現了要移除並示警。
- **破壞性資料庫操作**（`prisma migrate reset`、刪資料、改 schema 的 migration、`db:seed` 覆蓋）
  必須先備份、先驗證，並經老闆明確同意才做。一般開發用本機/測試 DB。
- 不自行推翻既有核心架構；重大架構變更要以 `docs/ai-bus` 的 `type: decision` 留痕 + PO 核准。
- 不去動別的代理正在進行中的 PR／分支（除非被指派接手）。
- `Ledger`（獨立會計系統）不與品牌系統共用資料庫或直接串 API。

## 視覺／設計類工作

首頁 hero 等「要邊做邊看」的視覺動畫，**交給本地 Claude Code**（能開瀏覽器實機驗證），
不適合純雲端盲做。規格清楚、可自動驗收的工程工作才交給雲端 Action。
設計審美與既有方向見 `apps/frontend/DESIGN.md`。

## 完成的定義（Definition of Done）

1. 滿足 issue 的驗收條件。 2. 相關 `typecheck`（必要時 `lint`/`test`）通過。
3. 不含密鑰、無破壞性副作用。 4. 開 PR、連結回對應 issue、說明怎麼驗證。
