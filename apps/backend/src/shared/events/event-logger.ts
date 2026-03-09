import { eventBus } from "./event-bus";

/**
 * Event Logger
 * --------------------------------------------------
 * 系統層 subscriber，用於：
 * - 驗證事件是否正常流動
 * - 開發期觀察 Domain Event
 *
 * 這個檔案不包含任何業務邏輯
 * 只能有 side effect（console / log / forward）
 */

eventBus.subscribe((event) => {
  console.log("📣 Domain Event:", {
    type: event.eventType,
    aggregate: event.aggregateType,
    id: event.aggregateId,
    at: event.occurredAt,
  });
});
