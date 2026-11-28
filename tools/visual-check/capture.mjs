// visual-check — 用真實瀏覽器錄下頁面/動畫，逐格抽出，拼成 contact sheet，
// 用來抓「單張截圖會漏掉的一瞬間過場鬼影」。可重現、不需人在場。
//
// 用法：
//   node capture.mjs --url=http://localhost:3001/ --out=./out --duration=10000 --fps=10 --cols=8
// 選項：
//   --url       要錄的網址（預設 http://localhost:3001/）
//   --out       輸出資料夾（預設 ./out）
//   --duration  錄多久（毫秒，預設 10000）
//   --fps       抽格速率（預設 10）
//   --width/--height  視窗大小（預設 1600x900）
//   --cols      contact sheet 每列幾格（預設 8）
//   --scroll    錄製中捲動到底再回頂（抓捲動視差/進場），帶了就啟用
// 環境：FFMPEG=ffmpeg 執行檔路徑（預設 "ffmpeg"）
//
// 前置：npm install && npx playwright install chromium（見 README）

import { chromium } from 'playwright';
import { execFileSync } from 'node:child_process';
import { mkdirSync, rmSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const args = Object.fromEntries(process.argv.slice(2).map(a => {
  const m = a.match(/^--([^=]+)=(.*)$/);
  return m ? [m[1], m[2]] : [a.replace(/^--/, ''), true];
}));

const url = args.url || 'http://localhost:3001/';
const out = args.out || './out';
const duration = parseInt(args.duration || '10000', 10);
const fps = parseInt(args.fps || '10', 10);
const width = parseInt(args.width || '1600', 10);
const height = parseInt(args.height || '900', 10);
const cols = parseInt(args.cols || '8', 10);
const doScroll = !!args.scroll;
const FFMPEG = process.env.FFMPEG || 'ffmpeg';

rmSync(out, { recursive: true, force: true });
mkdirSync(out, { recursive: true });
const videoDir = join(out, 'video');
mkdirSync(videoDir, { recursive: true });

console.log(`[visual-check] 錄製 ${url}  ${width}x${height}  ${duration}ms`);
const browser = await chromium.launch();
const context = await browser.newContext({
  viewport: { width, height },
  deviceScaleFactor: 1,
  recordVideo: { dir: videoDir, size: { width, height } },
  reducedMotion: 'no-preference',
});
const page = await context.newPage();
await page.goto(url, { waitUntil: 'load', timeout: 30000 });

if (doScroll) {
  const steps = Math.max(1, Math.floor(duration / 400));
  for (let i = 0; i < steps; i++) {
    const t = i / steps;
    const phase = t < 0.5 ? t * 2 : (1 - t) * 2; // 下去再回來
    await page.evaluate((p) => window.scrollTo(0, document.body.scrollHeight * p), phase);
    await page.waitForTimeout(400);
  }
} else {
  await page.waitForTimeout(duration);
}

await context.close(); // flush video
await browser.close();

const vids = readdirSync(videoDir).filter(f => f.endsWith('.webm'));
if (!vids.length) { console.error('沒有產生影片'); process.exit(1); }
const video = join(videoDir, vids[0]);
console.log('[visual-check] video:', video);

const framesDir = join(out, 'frames');
mkdirSync(framesDir, { recursive: true });
execFileSync(FFMPEG, ['-y', '-i', video, '-vf', `fps=${fps}`, join(framesDir, 'f%03d.png')], { stdio: 'inherit' });

const frames = readdirSync(framesDir).filter(f => f.endsWith('.png'));
const rows = Math.ceil(frames.length / cols);
// contact sheet：每格縮到寬 240，拼成 cols×rows 網格（左上為第 0 格，由左而右、由上而下遞增）
execFileSync(FFMPEG, [
  '-y', '-framerate', '1', '-i', join(framesDir, 'f%03d.png'),
  '-vf', `scale=240:-2,tile=${cols}x${rows}:padding=4:color=0x222222`,
  '-frames:v', '1', join(out, 'contact.png'),
], { stdio: 'inherit' });

console.log(`[visual-check] 完成：${join(out, 'contact.png')}  共 ${frames.length} 格（${cols}x${rows}），每格間隔 ${1000 / fps}ms，第 i 格時間 ≈ i×${1000 / fps}ms`);
