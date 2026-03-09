import { mockProducts } from "./product.mock";
import { Product } from "./product.types";
import { eventBus } from "../../shared/events/event-bus";
import { DomainEvent } from "../../shared/events/domain-event";
import { randomUUID } from "crypto";

/**
 * ProductService
 * ====================================================
 * 【責任】
 * - 提供產品「事實資料」
 * - 可選擇是否發出 Domain Event
 *
 * 【設計重點】
 * - 預設會發 PRODUCT_REQUESTED
 * - Read Model / Snapshot 可透過 suppressEvent 關閉事件
 */
export class ProductService {
  getProduct(
    productId: string,
    options?: { suppressEvent?: boolean }
  ): Product | null {
    const product = mockProducts.find((p) => p.id === productId) ?? null;

    // 預設會發事件，除非明確抑制
    if (!options?.suppressEvent) {
      const event: DomainEvent = {
        eventId: randomUUID(),
        eventType: "PRODUCT_REQUESTED",
        aggregateType: "product",
        aggregateId: productId,
        occurredAt: new Date(),
        payload: {
          productId,
          found: product !== null,
        },
      };

      eventBus.publish(event);
    }

    return product;
  }
}
