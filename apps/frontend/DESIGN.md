# 永裕工藝 — 設計系統（DESIGN.md）

本文件記錄前台實際落實的設計系統，供後續開發與 AI 代理遵循。**原則：一套系統、克制、精品感、工程級交付（對比、狀態、RWD 一個都不能少）。**

目標客群：高端手工金工珠寶。前台頁面屬 **Experience / Persuade** 模式（作品攝影與質感為主角）；`/admin` 後台屬 **Operate** 模式（刻意的極簡功能性介面，不套用前台金色語言）。

---

## 色票 Tokens
定義於 `app/globals.css` 的 `:root`。**一律引用語意，不要再硬寫新色碼；金色全站只有一種。**

| 用途 | 值 | 備註 |
|---|---|---|
| 主背景 | `#080706` | 近黑，主要區塊 |
| 次背景 | `#111010` / `#0D0D0B` / `#0D0C0B` | 卡片、頁尾、分隔區 |
| **品牌金（唯一）** | `#C49A5A` | `--color-gold`。深金 `#8C6E42`、淺金 `#D4B896` 僅作描邊/陰影輔助 |
| 主文字 | `#F0EBE0` / `#E8ECF0` | 標題、正文 |
| 次文字 | `#B8B3AD` / `#A8A39D` | 說明、標籤、空狀態 |
| 弱文字 | `#9A9590` | 版權、極次要資訊（仍需 ≥4.5:1） |
| 錯誤 | `#f87171` | 暗底可讀的紅（勿用 `#c0392b`/`#666`，對比不足） |
| 邊框 | `rgba(196,154,90,0.08 – 0.30)` | 金色低透明度；輸入底線 ≥0.30 才看得見 |
| 點綴 | 玉 `#3D6B5C`、燼 `#8B4A28` | 極少用，非必要不出現 |

**已淘汰**：`tailwind.config.ts` 原本那組淺色 `yyc.*` 色票（與暗色站矛盾、零使用）已移除。

### 禁用的低對比值（過不了 WCAG，勿再出現於文字）
`#6B6560`、`#666`、`#555`、`rgba(255,255,255,0.18/0.3)`、`rgba(232,236,240,0.18/0.25/0.3/0.4)`、`rgba(196,154,90,0.5/0.55)` 作為文字色。導覽未選態最低用 `0.6`，金色標籤最低 `0.75`。

---

## 字體 Typography
`app/layout.tsx` 透過 `next/font` 載入，weights 300/400/500。

- **襯線 Noto Serif TC**（`--font-noto-serif-tc`）：品牌名、大標題、作品名、數字。
- **無襯線 Noto Sans TC**（`--font-noto-sans-tc`）：正文、介面、表單。
- 大標題 `clamp(1.75rem, 4vw, 2.5rem)`；Hero 可到 `clamp(2.5rem, 5vw, 5rem)`。正文 15–17px / line-height 1.75–2.2。

### 字距 Letter-spacing
品牌/標題 `0.12–0.15em`；eyebrow/區段標籤 `0.2–0.5em`（全大寫拉丁字）；介面 `0.08–0.15em`；正文 `0.03–0.06em`。

---

## 對比底線（硬性）
- 正文與標籤 **≥4.5:1**，大型文字 **≥3:1**。
- 暗色面上的次要文字用暖色階（`#B8B3AD`/`#A8A39D`/`#9A9590`），不用純低透明白。
- 每次改版用真實/無頭瀏覽器檢查渲染結果，不只看原始碼。

---

## 元件與範式 Patterns
- **作品卡縮圖** `.works-card-thumb`（3:4）：有 `coverImage` → `.works-card-img`（`object-fit:cover`，hover 微放大 1.04，尊重 reduced-motion）；無圖 → `.works-card-fallback`（襯線字首字、`opacity:0.12`）。**首頁與型錄一致。**
- **作品詳情 Hero 影片**（可選）：少數作品配有 bespoke 氛圍循環影片（1920×1080、約 10s 無縫循環、近黑底金光、無文字）。`lib/heroVideos.ts` 以 coverImage 的資料夾 slug（`/images/works/<slug>/…`）對照 `/videos/…`；命中則詳情頁 Section 1 用 `WorkHeroVideo`（`muted/autoplay/loop/playsInline`、`object-fit:cover`、poster=封面、尊重 `prefers-reduced-motion` 時只顯示靜態 poster），未命中則回退 `WorkHeroImage`。影片本身在倉庫外的 HyperFrames 專案產生，成片置於 `public/videos/`。**首頁 hero 已是互動式戒指 hero，不套用此影片**（避免兩只戒指打架或失去互動）。
- **空狀態**：資料為 0 時必須有設計過的空狀態（標題＋說明＋導流 CTA），不可讓區塊直接消失。
- **CTA 按鈕** `.btn-cta-outline`：金色描邊，hover 由左 `scaleX` 填滿、文字轉深色。
- **頁尾**：左品牌（襯線，金 `0.85`）／右版權（`#9A9590`）。全站統一。
- **導覽**：fixed、`rgba(8,7,6,0.85)` + `backdrop-filter: blur(12px)`、底部金色細線；未選態文字 `0.6`。

## 分類中文化
`lib/categories.ts` 的 `categoryLabel(id)`：ring→戒指、necklace→項鍊、bracelet→手鍊、bangle→手環、earring→耳環、pendant→墜飾…未收錄者原樣退回。**前台不可出現原始英文 id**（首頁卡、型錄篩選、作品卡、詳情頁 eyebrow 皆已接）。

## 動態 Motion（無障礙）
- 尊重 `prefers-reduced-motion`：`SmoothScrollProvider` 在使用者要求減少動態時停用 Lenis、回原生捲動；`globals.css` 有全站 CSS reduced-motion 重置。
- 動態克制：一個主要動態時刻，hover/進場細微即可（exponential ease-out）。
- **游標用原生**（已移除全站自訂游標；電商需精準點擊）。

## 瀏覽器表面
`::selection` 金底深字；捲軸隱藏；表單 focus 金色底線。這些「沒畫到的地方」也要上主題。

## 後台 Admin（Operate）
刻意與前台不同：`system-ui`、`#0a0a0a` 底、灰階文字、`#c4a87a` 品牌金。維持工具性即可，只需確保對比達標（登出、表單標籤已修），**不要把前台金色主題硬套進來**。

---

## 工作流（交付標準）
每次 UI 變更：**改 → 真實瀏覽器驗證渲染（含各斷點）→ 確認對比/狀態/RWD → 小而完整地提交**。相關技能：`impeccable`、`design-taste-frontend`、`hallmark`（皆內建瀏覽器級檢查）。
