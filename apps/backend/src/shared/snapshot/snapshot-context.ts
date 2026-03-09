/**
 * SnapshotContext
 * ====================================================
 * Snapshot 與 Domain Event 之間的因果橋樑
 *
 * ⚠️ 注意：
 * - 這不是對外 API
 * - 只在系統內部流動
 * - 未來可以由 Event Store / CDC / DB 補齊
 */
export interface SnapshotContext {
  /** 造成此 Snapshot 的事件 ID */
  causedByEventId: string;

  /** 事件類型（例如 PRODUCT_REQUESTED） */
  eventType: string;

  /** 事件發生時間 */
  occurredAt: Date;
}
