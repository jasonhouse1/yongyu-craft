# visual-check — 逐格視覺檢查工具

用**真實瀏覽器**把頁面/動畫錄成影片，逐格抽出拼成 contact sheet，
用來抓**單張截圖會漏掉的「一瞬間過場瑕疵」**（例如動畫中途的鬼影、進場白閃、
元素短暫重疊）。可重現、不需人在場盯著。

比起 headless 截圖，它用真實瀏覽器即時錄影，能正確捕捉 framer-motion / CSS 動畫的
實際播放過程（不受 headless 虛擬時間抓不準的影響）。

## 前置（一次）

```bash
cd tools/visual-check
npm install
npx playwright install chromium   # 下載 ~120MB Chromium
# ffmpeg 要能用：設環境變數 FFMPEG 指向 ffmpeg 執行檔，或讓它在 PATH 裡
```

## 用法

先確保要看的網站有在跑（例如 `pnpm dev:frontend` → http://localhost:3001）。

```bash
# 錄首頁 hero 10 秒、每秒 10 格：
FFMPEG=/path/to/ffmpeg node capture.mjs --url=http://localhost:3001/ --out=./out --duration=10000 --fps=10 --cols=8

# 看捲動視差/進場（錄製中自動捲到底再回頂）：
node capture.mjs --url=http://localhost:3001/ --scroll --duration=12000
```

產出在 `--out` 資料夾：
- `video/*.webm` — 原始錄影
- `frames/f*.png` — 逐格 PNG
- `contact.png` — 拼好的 contact sheet（左上第 0 格，由左而右、由上而下；第 i 格時間 ≈ i × (1000/fps) ms）

接著由 AI（或人）直接看 `contact.png`，掃視整段時間軸找瞬間瑕疵；
可疑的某一格再去 `frames/` 看全解析度原圖。

## 參數

| 參數 | 預設 | 說明 |
|---|---|---|
| `--url` | `http://localhost:3001/` | 要錄的網址 |
| `--out` | `./out` | 輸出資料夾 |
| `--duration` | `10000` | 錄多久（ms） |
| `--fps` | `10` | 抽格速率 |
| `--width`/`--height` | `1600`/`900` | 視窗大小 |
| `--cols` | `8` | contact sheet 每列格數 |
| `--scroll` | 關 | 錄製中自動捲動（抓視差/進場） |

## 注意

- `out/`、`node_modules/`、Playwright 瀏覽器不入庫（見 `.gitignore`）。
- 這是**本地/CI 的驗證工具**，不是 app 執行時的相依套件，和 `apps/*` 的相依分開。
