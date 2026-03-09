import { ProductService } from "../../modules/product/product.service";
import { snapshotSeqProvider } from "../snapshot/snapshot-seq-provider";
import { SnapshotContext } from "../snapshot/snapshot-context";
import { ProductSnapshot } from "../../modules/product/snapshot/product-snapshot";

/**
 * ValueAuthority
 * ====================================================
 * 對外唯一可信 Snapshot 組裝者（Read Model）
 *
 * ❗重要原則：
 * - Snapshot 屬於「讀模型」
 * - 不得再產生 Domain Event
 */
export class ValueAuthority {
  constructor(private readonly productService: ProductService) {}

  getProductSnapshot(
    productId: string,
    context?: SnapshotContext
  ): ProductSnapshot | null {
    // ⛔ 明確抑制事件，避免遞迴
    const product = this.productService.getProduct(productId, {
      suppressEvent: true,
    });

    if (!product) {
      return null;
    }

    return {
      snapshotSeq: snapshotSeqProvider.next(),
      generatedAt: new Date().toISOString(),

      product: {
        id: product.id,
        name: product.name,
        price: product.price,
        currency: product.currency,
      },

      consistency: {
        source: "mock",
        status: "consistent",
      },

      causedBy: context
        ? {
            eventId: context.causedByEventId,
            eventType: context.eventType,
            occurredAt: context.occurredAt.toISOString(),
          }
        : null,
    };
  }
}
