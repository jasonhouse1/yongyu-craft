// apps/backend/src/shared/value-authority/value-authority.ts
import { ProductService } from "../../modules/product/product.service";
import { ProductRepository } from "../../modules/product/product.repository";
import { ProductSnapshot } from "../../modules/product/snapshot/product-snapshot";

export class ValueAuthority {
  private readonly service: ProductService;

  constructor() {
    this.service = new ProductService(new ProductRepository());
  }

  async getProductSnapshot(productId: string): Promise<ProductSnapshot | null> {
    return this.service.getProduct(productId, { suppressEvent: true });
  }
}
