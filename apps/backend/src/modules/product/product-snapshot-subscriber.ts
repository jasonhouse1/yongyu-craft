import { eventBus } from "../../shared/events/event-bus";
import { DomainEvent } from "../../shared/events/domain-event";
import { SnapshotContextFactory } from "../../shared/snapshot/snapshot-context-factory";
import { ProductSnapshotStore } from "../../shared/snapshot/product-snapshot-store";
import { ProductService } from "./product.service";
import { ValueAuthority } from "../../shared/value-authority/value-authority";

/**
 * ProductSnapshotSubscriber
 * ====================================================
 * Projection Subscriber
 *
 * 職責：
 * - 訂閱 Product Domain Event
 * - 將事件轉換為 Snapshot（Projection）
 * - 寫入 Snapshot Store
 *
 * ❗注意：
 * - 不包含任何業務邏輯
 * - 允許重放（replay）
 * - 允許覆蓋（last-write-wins）
 */

// Infrastructure 組裝（Phase 3 會交給 DI）
const productService = new ProductService();
const valueAuthority = new ValueAuthority(productService);
const productSnapshotStore = new ProductSnapshotStore();
const snapshotContextFactory = new SnapshotContextFactory();

// Subscribe Product Events
eventBus.subscribe((event: DomainEvent) => {
  if (event.aggregateType !== "product") {
    return;
  }

  if (event.eventType !== "PRODUCT_REQUESTED") {
    return;
  }

  const productId = event.aggregateId;

  // 建立 Snapshot 因果來源
  const context = snapshotContextFactory.fromDomainEvent(event);

  // 產生 Snapshot
  const snapshot = valueAuthority.getProductSnapshot(productId, context);

  if (!snapshot) {
    return;
  }

  // ✅ 正確寫入方式（不再有 set）
  productSnapshotStore.save(snapshot);
});
