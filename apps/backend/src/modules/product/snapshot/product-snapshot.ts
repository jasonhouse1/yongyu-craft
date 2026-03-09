/**
 * ProductSnapshot
 * ====================================================
 * 對外「產品快照」的唯一契約定義
 *
 * ⚠️ 非常重要：
 * - Controller / ValueAuthority 只能回傳這個型別
 * - 新欄位只能「擴充」，不能破壞既有結構
 * - 這是 API / Event / Snapshot Service 的共同語言
 */
export interface ProductSnapshot {
  /** Snapshot 全域序號 */
  snapshotSeq: number;

  /** 快照生成時間（ISO 8601） */
  generatedAt: string;

  /** 產品事實 */
  product: {
    id: string;
    name: string;
    price: number;
    currency: string;
  };

  /** 一致性資訊 */
  consistency: {
    source: "mock" | "db" | "event";
    status: "consistent" | "stale";
  };

  /**
   * Phase 2.2：
   * Snapshot 的因果來源（可為 null）
   *
   * - 代表「這個快照是因為哪個事件產生的」
   * - API 呼叫時可能為 null
   * - Event-driven Snapshot 時必定存在
   */
  causedBy: {
    eventId: string;
    eventType: string;
    occurredAt: string;
  } | null;
}
