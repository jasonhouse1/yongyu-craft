import {
  Product,
  ProductRepository,
  FindProductsOptions,
} from "./product.repository";
import type { ProductSnapshot } from "./snapshot/product-snapshot";
import { outboxProcessor } from "../../shared/outbox/outbox-processor";

export interface GetProductOptions {
  suppressEvent?: boolean;
}

function createProductSnapshot(product: Product): ProductSnapshot {
  return {
    product,
    snapshotSeq: "0",
    generatedAt: new Date().toISOString(),
    consistency: "strong",
    causedBy: {
      type: "compat",
      id: product.id,
    },
  } as unknown as ProductSnapshot;
}

export class ProductService {
  constructor(private readonly repo: ProductRepository) {}

  async getProduct(
    id: string,
    options?: GetProductOptions
  ): Promise<ProductSnapshot | null> {
    const product = await this.repo.findById(id);
    if (!product) return null;

    if (!options?.suppressEvent) {
      await outboxProcessor.publish({
        aggregateType: "product",
        aggregateId: id,
        eventType: "PRODUCT_VIEWED",
        payload: { productId: id },
      });
    }

    return createProductSnapshot(product);
  }

  async getProductBySlug(slug: string): Promise<ProductSnapshot | null> {
    const product = await this.repo.findBySlug(slug);
    if (!product) return null;

    return createProductSnapshot(product);
  }

  async getProducts(options?: FindProductsOptions): Promise<{
    items: ProductSnapshot[];
    total: number;
    page: number;
    limit: number;
  }> {
    const result = await this.repo.findAll(options);

    return {
      ...result,
      items: result.items.map((product: Product) => createProductSnapshot(product)),
    };
  }

  async getFeaturedProducts(limit = 3): Promise<ProductSnapshot[]> {
    const result = await this.repo.findAll({ limit });

    return result.items
      .slice(0, limit)
      .map((product: Product) => createProductSnapshot(product));
  }
}
