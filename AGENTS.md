# AGENTS.md — 永裕工藝 AI 代理共用規範

所有在本專案工作的 AI 代理（ChatGPT、Claude Code 本地、Claude Code Action 雲端、
GitHub Copilot 等）都遵守這份規範。Claude 另有 `CLAUDE.md`；內容衝突時以 `CLAUDE.md` 的
技術細節為準，本檔定義**協作制度**。

## 角色

| 代號 | 角色 | 職責 |
|---|---|---|
| `po` | 老闆（Product Owner） | 最終決策。需求、品牌方向、重大架構、合併 main 的拍板。 |
| `chatgpt` | 架構／設計／審查總監 | 下目標與規格、審 PR、定驗收標準。**主審查、提供目標。** |
| `claude-code`（本地） | 主開發工程師 | 跑老闆電腦：實作、瀏覽器實機驗證、難的視覺動畫、把關。 |
| `claude-action`（雲端） | 自動實作者 | 被 `@claude` 觸發，在 GitHub Actions 開 PR。規格明確的工程工作。 |

## 核心流程（issue → PR → 審查 → 共識 → 合併）

1. **定目標**：`chatgpt`（或 `po`）開 issue，用 `AI Task` 模板，**寫清楚驗收條件**。
2. **實作**：由 Claude 撰寫——雲端（issue 內 `@claude`）或本地（老闆在終端機跑）。在 **feature branch** 做，開 **PR** 連回 issue。
3. **審查**：`chatgpt` 審 PR，逐點給意見。實作者**可以提出不同意見與證據**，不無條件接受。
4. **共識**：來回修正到雙方意見一致（審查者與實作者是不同身分，刻意保留互相挑錯的能力）。
5. **合併**：達成共識且 CI 通過後，由 `po` 決定併入 main。

## 鐵律

- 禁止 commit 任何密鑰／`.env`／token／完整 DB 連線字串。
- 破壞性操作（刪資料、Migration、正式部署）先備份、先驗證、經 PO 同意。
- 不直接推 `main`；一切經 PR。
- 不無條件同意對方：發現問題要附**證據＋替代方案**。
- `AGENTS.md` / `CLAUDE.md` 的修改屬「PO 核准」類別。
- 跨 AI 的技術交接走**檔案**（`docs/ai-bus/` 信箱、issue、PR），不靠口頭轉述。

## 入口索引

- 信箱協定：`docs/ai-bus/README.md`
- 給 ChatGPT 的上手＋寫入權＋自動迴圈：`docs/ai-bus/FOR-CHATGPT.md`
- Claude 技術指引：`CLAUDE.md`
- 開發現況：`docs/DEVELOPMENT_STATUS.md`
- 設計系統：`apps/frontend/DESIGN.md`
