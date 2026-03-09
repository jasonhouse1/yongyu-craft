import { DomainEvent } from "../events/domain-event";
import { SnapshotContext } from "./snapshot-context";

/**
 * SnapshotContextFactory
 * ====================================================
 * 將 Domain Event 轉換為 Snapshot 可用的 Context
 *
 * 職責：
 * - 純轉換（無副作用）
 * - 不讀寫資料
 * - 不依賴任何 Service
 */
export class SnapshotContextFactory {
  fromDomainEvent(event: DomainEvent): SnapshotContext {
    return {
      causedByEventId: event.eventId,
      eventType: event.eventType,
      occurredAt: event.occurredAt,
    };
  }
}

/**
 * 全系統共用的 SnapshotContextFactory instance
 * ----------------------------------------------------
 * - 避免各處 new
 * - 方便未來替換 / mock
 */
export const snapshotContextFactory = new SnapshotContextFactory();
