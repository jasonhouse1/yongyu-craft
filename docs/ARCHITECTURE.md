# 架構（ARCHITECTURE）

> 由 Claude Code 讀過實際程式碼後整理（2026-11-28）。標「推論」者尚待確認。
> 技術指令與護欄見 `CLAUDE.md`；協作制度見 `AGENTS.md`。

## 總覽

pnpm monorepo（`workspaces: apps/*`），兩個獨立部署的應用：

```
yongyu-craft/
├─ apps/frontend   Next.js 15 (App Router) / React 19 / Tailwind 4   :3001(dev)
├─ apps/backend    Express 5 / Prisma 6 / PostgreSQL                 :3000(dev)
└─ docs/, tools/, docs/ai-bus/
```

部署（推論）：Railway——後端 CORS 白名單含 `*.up.railway.app` 的前端網址。

---

## 前端 `apps/frontend`

Next.js App Router。頁面是 async Server Component，透過 `lib/api.ts` 向後端 REST 取資料；
需要互動/動畫的用 `"use client"`。

**路由分三區：**
- **公開**：`/`(首頁 hero)、`/about`、`/contact`、`/inquiry`(詢價)、`/works`(作品集)、`/works/[category]/[id]`(作品詳情)
- **會員** `/member`：`login`/`register`/`forgot-password`/`reset-password`、`favorites`、`inquiries`、`settings`（登入態由 `lib/member-context.tsx` 提供）
- **後台** `/admin`：`login`、`works`(列表/`new`/`[id]/edit`)、`inquiries`、`campaigns`(列表/`new`/`[id]/edit`)
- **API route**：`/api/upload`（圖片上傳，前端代理）

**動畫/視覺堆疊**：framer-motion（hero 等，SSR 用 mount-gate 防 hydration 不一致）、
GSAP(`lib/gsap.ts`)、Lenis 平滑捲動(`components/providers/SmoothScrollProvider.tsx`)、
`components/ui/CustomCursor.tsx`、`PageTransition.tsx`。

**關鍵元件**：`hero/RingHero`(電影級鑽戒開場)、`hero/CraftSection`、`works/WorksGallery`、
`ui/WorkHeroVideo`+`ui/WorkHeroImage`(作品詳情頂部影片/圖，見 `lib/heroVideos.ts`)、
`ui/CampaignBanner`、`ui/Footer`、`ui/FavoriteButton`、`admin/ImageUploader`。

**i18n**：資料層雙語（Work/Category 等有 `*Zh`/`*En` 欄位）＋ `messages/zh.json` 介面字串；
分類顯示名 `lib/categories.ts`。設計系統見 `apps/frontend/DESIGN.md`。

> ⚠ `apps/frontend/AGENTS.md`：此 Next 版本有破壞性變更，**寫前端程式碼前先讀 `node_modules/next/dist/docs/`**。

---

## 後端 `apps/backend`

Express 5，模組化：每個 `src/modules/<domain>/` 用 **controller → service → repository** 分層。

**路由（`src/server.ts`）：**
| 掛載點 | 模組 | 說明 |
|---|---|---|
| `/api/works` | work | 作品查詢（公開）|
| `/api/inquiries` | inquiry | 詢價提交/查詢 |
| `/api/campaigns` | campaign | 進行中活動橫幅 |
| `/api/admin/works` | admin | 作品 CRUD（需後台授權）|
| `/api/admin/inquiries` | admin | 詢價管理 |
| `/api/admin/campaigns` | campaign | 活動 CRUD |
| `/api/member` | member | 會員認證 + 個人檔案/收藏 |
| `/health` | — | DB 連線檢查 |

**橫切關注：**
- **安全**：helmet、CORS（白名單 localhost:3000/3001 + `FRONTEND_URL`）、express-rate-limit
  （general/inquiry/admin/auth 四組；**dev 模式 `skip`**——目前 `server.ts` 有一段未入庫的 dev 跳過）。
- **認證**：JWT。`shared/middleware/admin-auth.middleware.ts` 與 `member-auth.middleware.ts` 分離（後台/會員兩套）。
- **Email**：`shared/email/email.service.ts`（Resend）。
- **Transactional Outbox**：`shared/outbox/outbox-processor.ts` + `OutboxEvent` 資料表——
  寫入與副作用（寄信/事件）解耦，`outboxProcessor` 在啟動時輪詢 pending 事件派送。
- **Snapshot / Value Authority**：`shared/value-authority/`、`modules/*/…-snapshot.ts`、
  `SnapshotSequence` 表——不可變快照與序號機制（推論：為可稽核性 / 詢價當下狀態留痕；
  與老闆規劃中的獨立會計系統 `Ledger` 的「權威紀錄」概念相關，但 Ledger 另案、不共用 DB）。

---

## 資料模型（Prisma / PostgreSQL，`apps/backend/prisma/schema.prisma`）

**核心內容**
- `Work`（作品，主力模型）：雙語、材質/工法陣列、尺寸/重量/年份、定價(fixed/range/inquiry)、
  狀態(draft/published/archived)、封面/多圖/影片、SEO 與 AI 欄位、精選/可客製旗標、瀏覽數。
- `WorkImage`（作品多圖）、`Category`（雙語 slug 分類）。
- `Product`（舊模型，推論：已大致被 `Work` 取代，部分 admin 仍留）。

**互動 / 交易**
- `Inquiry`（詢價：類型 artwork/custom/appointment/corporate/international、狀態機 new→…→closed、預算/用途/聯絡偏好）。
- `Order`（訂單：pending/paid/cancelled/refunded）。
- `Campaign`（活動橫幅：啟用期間、CTA、顏色）。

**會員**
- `Member`（email 唯一、passwordHash、驗證/重設 token）、`Favorite`（會員×作品，cascade）。

**基礎設施**
- `OutboxEvent`（事件外寄表）、`SnapshotSequence`（快照序號）。

---

## 環境變數（不入庫）

`DATABASE_URL`（Postgres）、`FRONTEND_URL`、JWT 密鑰、Resend API key 等——只在各自部署環境/`.env`，
**永不進 repo**（見 `CLAUDE.md` 護欄）。

## 已知/值得注意

- `Product` 與 `Work` 並存——疑為遷移殘留，待釐清是否可移除 `Product` 與相關 admin/路由。
- `server.ts` 的 dev rate-limit `skip` 尚未入庫；正式環境 rate-limit/安全性待盤點。
- CI（`.github/workflows/ci.yml`）目前只跑前後端 typecheck，未含 lint/build/test。
