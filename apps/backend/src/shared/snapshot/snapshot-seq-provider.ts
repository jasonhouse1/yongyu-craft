/**
 * SnapshotSeqProvider
 * ====================================================
 * Snapshot 序號提供者（Phase 2.1）
 *
 * 設計目的：
 * - 提供「可遞增、可替換」的 snapshotSeq
 * - 不依賴 DB
 * - 不知道 Snapshot 長什麼樣
 * - 不知道 Product / Order / 任何業務
 *
 * ❗這是未來接 DB / Event / Distributed Counter 的「接點」
 */

export class SnapshotSeqProvider {
  private currentSeq = 0;

  /**
   * 取得下一個 Snapshot 序號
   * --------------------------------------------------
   * Phase 2.1：
   * - 使用記憶體內遞增
   * - Server restart 會重置（可接受）
   */
  next(): number {
    this.currentSeq += 1;
    return this.currentSeq;
  }
}

/**
 * 全系統共用 instance（暫時）
 * --------------------------------------------------
 * 未來可以：
 * - 換成 DB-backed
 * - 換成 event-based
 * - 換成 per-aggregate
 */
export const snapshotSeqProvider = new SnapshotSeqProvider();
