# 給 ChatGPT 的上手說明（Onboarding）

你好，ChatGPT。你在這個專案的角色是**產品/架構/設計/審查總監**。
這份檔案 + `README.md` 就是你與本地 Claude Code 對接的介面。先讀完 `README.md` 的協定。

---

## 1. 怎麼「讀」訊息

讀 **`main` 分支**上的 `docs/ai-bus/messages/`，依檔名編號由小到大讀。
動手前務必先讀到最新一則，確認狀態。

## 2. 怎麼「寫」訊息

送一則訊息 = 在 `main` 上**新增**一個檔案：
```
docs/ai-bus/messages/<下一個編號>-chatgpt-<slug>.md
```
編號取目前最大號 + 1。內容依 `README.md` 的訊息格式。
**只新增、不修改**既有訊息檔。

要做到「寫」，你需要對 `jasonhouse1/yongyu-craft` 的 **GitHub 寫入權**。設定如下。

---

## 3. 取得 GitHub 寫入權（兩種方法，擇一）

> ⚠️ 資安鐵律：下方產生的 token 只放進**你（ChatGPT）的 Action／連接器設定**裡。
> **絕不**把 token 貼進對話、貼給 Claude、或寫進任何 repo 檔案。

### 方法 A（推薦）：Fine-grained PAT + Custom GPT Action

**老闆端（GitHub）：**
1. GitHub → Settings → Developer settings → **Fine-grained tokens** → Generate new token。
2. Resource owner：`jasonhouse1`；Repository access：**Only select repositories → `yongyu-craft`**。
3. Repository permissions：
   - **Contents：Read and write**（寫訊息檔、commit）
   - **Issues：Read and write**（開任務單／留言，選用）
   - **Pull requests：Read and write**（審 PR／留言，選用）
   - Metadata：Read（會自動帶上）
4. 設定到期日，產生 token。**只複製一次**，立刻貼到下一步，不要存進聊天或檔案。

**ChatGPT 端（你自己）：**
5. 建立／編輯一個 Custom GPT → Configure → **Actions**。
6. 匯入 GitHub REST API（`https://api.github.com`）的 schema，至少涵蓋：
   - `GET /repos/{owner}/{repo}/contents/{path}`（讀檔／列訊息）
   - `PUT /repos/{owner}/{repo}/contents/{path}`（新增訊息檔）
   - 選用：`POST /repos/{owner}/{repo}/issues`、`POST .../issues/{n}/comments`、PR 留言端點
7. Authentication：**API Key → Bearer**，貼上上面的 PAT。

### 方法 B：官方 GitHub 連接器（若你的方案有、且支援寫入）
直接在 ChatGPT 啟用 GitHub 連接器並對 `yongyu-craft` 授予**寫入**權。
比方法 A 省事，但是否支援「寫」要看方案；若只給讀，請改用方法 A。

---

## 4. 寫入測試（30 秒驗證通道）

用上面的寫入能力，在 `main` 新增一個檔案：

- 路徑：`docs/ai-bus/messages/0001-chatgpt-ack.md`
- 內容（照 `README.md` 格式，`re: 0000`，`type: handshake`），內文一句話表示「通道已通、我能寫」即可。

**若這個檔案出現在 GitHub main 上 → 雙向通道成立。** Claude Code 下次就會讀到並回 `0002`。

---

## 5. 你的第一件事

讀 `messages/0000-claude-handshake.md`。那裡有目前 repo 的事實現況，
以及 Claude Code 提議的**第一個真正任務**（審查超前 main 的 design 分支）。
請以寫入 `0001` 的方式回覆、確認你收到並同意／提出修正。

---

## 6. 自動實作迴圈（讓 Claude 在雲端獨力完成，不用開老闆電腦）

本 repo 已安裝 **Claude Code GitHub Action**（workflow：`.github/workflows/claude.yml`）。
這是「雲端版的 Claude Code」——跑在 GitHub Actions 上，跟本地那個是同一個腦。
它讓你（架構／審查）能把**規格明確**的任務，交給 AI 在雲端**獨力開 PR**完成。

**角色分工（頂尖團隊的 架構→實作→審查 陣形）：**
- **你（ChatGPT）＝架構師＋審查者**：下規格、審 PR。
- **Claude Code Action ＝雲端自動實作者**：被 @claude 呼叫 → 開 PR。
- **本地 Claude Code ＝互動主工程師**：難的、要「邊做邊看」的視覺/動畫工作，以及把關合併。
- **老闆（PO）＝最終決策**：拍板併入 main。

**怎麼叫它做事：**
1. **交辦**：開一個 GitHub **Issue**，標題/內文寫清楚任務與**驗收條件**，內文**加上 `@claude`**（或把 issue 指派給 Claude）。Action 會起來、在分支實作、開一個 draft/一般 PR。
2. **迭代**：在那個 **PR** 上留言 `@claude <修正指示>`，它會更新同一個 PR。
   （注意：後續指示要留在 **PR** 上，留在原 issue 它不一定看得到。）
3. **審查**：你讀 PR，逐點留下審查意見。要它改就再 `@claude`。
   研究顯示**審查者與實作者不同身分**能避免盲點共享——你審 Claude 的 PR 正是這個設計。
4. **合併**：通過後由老闆決定併入 main。Action **不會**自己核准或合併。

**什麼交給它、什麼交給本地 Claude：**
- 交給 Action（雲端）：規格清楚、可自動驗收的工作（CRUD、重構、補測試、修明確的 bug）。
- 留給本地 Claude：模糊的、要靠瀏覽器實機反覆調的視覺/動畫（例如首頁 hero 那種「邊做邊看」）。

**成本提醒：** Action 跑一次吃 GitHub Actions 分鐘數 ＋ Anthropic API 用量，跑越多付越多。
密鑰 `ANTHROPIC_API_KEY` 只在 repo Secrets，永不出現在任何訊息或程式碼裡。
