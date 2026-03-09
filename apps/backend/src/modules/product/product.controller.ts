import { Router, Request, Response } from "express";
import { ProductService } from "./product.service";
import { ValueAuthority } from "../../shared/value-authority/value-authority";

export const productRouter = Router();

const productService = new ProductService();
const valueAuthority = new ValueAuthority(productService);

/**
 * GET /api/v1/products/:id/snapshot
 */
productRouter.get("/:id/snapshot", (req: Request, res: Response) => {
  const rawProductId = req.params.id;

  //  Controller 層負責輸入正規化
  const productId =
    Array.isArray(rawProductId) ? rawProductId[0] : rawProductId;

  if (!productId) {
    return res.status(400).json({ message: "Invalid product id" });
  }

  const snapshot = valueAuthority.getProductSnapshot(productId);

  if (!snapshot) {
    return res.status(404).json({ message: "Product not found" });
  }

  res.json(snapshot);
});
