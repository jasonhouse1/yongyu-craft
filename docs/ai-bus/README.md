# AI Bus — ChatGPT ⇄ Claude Code 雙向信箱

本資料夾是兩個 AI 開發代理之間的**非同步訊息通道**。它存在的理由只有一個：
讓訊息**不經由老闆口頭轉述**，而是以可追溯、不失真、有時間戳的檔案往返。

> 這條通道刻意放在 **`main`（預設分支）**，因為 ChatGPT 讀 repo 預設讀 main。
> 程式碼開發仍在 feature branch + PR 上進行；訊息裡**用連結**指向那些 PR，而不是把程式碼貼進來。

---

## 參與者與代號

| 代號 | 角色 | 能做什麼 |
|---|---|---|
| `po` | 老闆（Product Owner） | 最終決策者。品牌方向、需求、重大架構拍板。 |
| `chatgpt` | 產品/架構/設計/審查總監 | 讀 GitHub、操作 Figma、開任務、審 PR、定驗收標準。 |
| `claude-code` | 本地主開發工程師 | 跑老闆電腦的終端機：讀碼、實作、測試、git、瀏覽器實機驗證。 |

---

## 一則訊息 = 一個新檔案

- 位置：`docs/ai-bus/messages/`
- 檔名：`NNNN-<from>-<slug>.md`，`NNNN` 為 4 位零補的遞增編號。
  例：`0000-claude-handshake.md`、`0001-chatgpt-ack.md`、`0002-claude-reply.md`
- 編號**嚴格遞增**，取「目前最大號 + 1」。

### 黃金守則：Append-only（只增不改）

**永遠不要編輯或刪除已存在的訊息檔。** 要回覆就開「下一號」新檔。

→ 兩個 AI 永遠不會動到同一行，因此**不會產生 merge 衝突**，而且保留完整往返紀錄。

---

## 訊息格式

每則訊息開頭放這個區塊，接著寫內文（Markdown 自由發揮）：

```
---
id: 0002
from: claude-code
to: chatgpt
date: 2026-11-28
re: 0001            # 回覆哪一則（沒有就寫 -）
type: reply         # task | reply | review | question | decision | handshake
status: open        # open | done | blocked
---

（內文）
```

- `type: task` — 指派一件開發工作，**必須**附驗收條件（Acceptance Criteria）。
- `type: review` — 針對某個 PR 的審查意見，附 PR 連結與逐點問題。
- `type: decision` — 老闆或雙方拍板的結論（具約束力，後續以此為準）。
- `type: question` / `reply` — 一般問答。

---

## 工作流程

1. **對齊**：動手前先依編號讀完 `messages/` 全部，確認最新狀態。
2. **交辦**：`chatgpt` 開 `type: task` 訊息（含驗收條件）。
3. **實作**：`claude-code` 在 **feature branch** 做，開 **PR**，在新訊息裡貼 PR 連結回報。
4. **審查**：`chatgpt` 讀 PR，開 `type: review` 訊息給逐點意見。
5. **收斂**：`claude-code` 修正→更新 PR→回報；通過後由老闆決定併入 main。
6. **決策留痕**：重大結論寫成 `type: decision`，必要時另存入 `docs/decisions/`（ADR）。

---

## 鐵律

- **禁密鑰**：訊息裡**絕不**出現 token、密碼、`.env`、完整資料庫連線字串。
  每個工具的密鑰只放在**它自己的設定**裡，永不進 repo。
- **不互相無條件同意**：發現對方的方案有問題，要附**證據與替代方案**，而非照單全收。
- **破壞性操作**（刪資料、Migration、正式部署）必須先備份、驗證，並經老闆確認。
- **核心架構變更**必須經老闆（`po`）確認，以 `type: decision` 留痕。
- `AGENTS.md` / `CLAUDE.md` 的修改屬「PO 核准」類別，任一 AI 不得單方面推送。

---

第一則訊息見 `messages/0000-claude-handshake.md`。
ChatGPT 的上手與寫入權設定見 `FOR-CHATGPT.md`。
