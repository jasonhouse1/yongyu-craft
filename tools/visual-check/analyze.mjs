// 逐格亮度異常偵測：自動找白閃/爆閃(過亮)、黑閃(過暗)、突跳(閃爍/彈跳)。
// 不用人工逐格掃 contact sheet，工具自己把可疑的瞬間標出來。
//
// 當獨立工具用：  FFMPEG=... node analyze.mjs <video> [fps]
// 當模組用：      import { analyzeVideo } from './analyze.mjs'
//
// 原理：ffmpeg signalstats 逐格算平均亮度 YAVG(0–255)，再用門檻與相鄰差值判異常。

import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';

export function analyzeVideo(video, fps = 20, FFMPEG = process.env.FFMPEG || 'ffmpeg') {
  const statsFile = `${video}.stats.txt`;
  execFileSync(FFMPEG, ['-y', '-i', video, '-vf', `fps=${fps},signalstats,metadata=print:file=${statsFile}`, '-an', '-f', 'null', '-'], { stdio: 'ignore' });

  const txt = readFileSync(statsFile, 'utf8');
  const yavg = [];
  for (const line of txt.split(/\r?\n/)) {
    const m = line.match(/lavfi\.signalstats\.YAVG=([\d.]+)/);
    if (m) yavg.push(parseFloat(m[1]));
  }

  const ms = 1000 / fps;
  const flags = [];
  for (let i = 0; i < yavg.length; i++) {
    const y = yavg[i];
    const reasons = [];
    if (y > 200) reasons.push(`過亮 YAVG=${y.toFixed(0)}（疑白閃）`);
    if (i > 2 && y < 6 && yavg[i - 1] > 20) reasons.push(`驟暗 YAVG=${y.toFixed(0)}（疑黑閃）`);
    if (i > 0 && Math.abs(y - yavg[i - 1]) > 55) reasons.push(`突跳 Δ=${(y - yavg[i - 1]).toFixed(0)}（疑閃爍/彈跳）`);
    if (reasons.length) flags.push({ i, t: Math.round(i * ms), y, reasons });
  }
  return { frames: yavg.length, fps, min: Math.min(...yavg), max: Math.max(...yavg), flags };
}

export function printReport(r) {
  console.log(`[analyze] ${r.frames} 格 @ ${r.fps}fps  亮度範圍 YAVG ${r.min.toFixed(0)}–${r.max.toFixed(0)}`);
  if (!r.flags.length) {
    console.log('[analyze] ✅ 無亮度異常（沒有白閃/黑閃/突跳）');
  } else {
    console.log(`[analyze] ⚠ 抓到 ${r.flags.length} 個可疑格（contact sheet 上去對同一格看）：`);
    for (const f of r.flags) console.log(`  第 ${f.i} 格 (~${f.t}ms): ${f.reasons.join('；')}`);
  }
}

// CLI
if (import.meta.url === `file://${process.argv[1]}` || process.argv[1]?.endsWith('analyze.mjs')) {
  const video = process.argv[2];
  const fps = parseInt(process.argv[3] || '20', 10);
  if (!video) { console.error('用法：node analyze.mjs <video> [fps]'); process.exit(1); }
  printReport(analyzeVideo(video, fps));
}
