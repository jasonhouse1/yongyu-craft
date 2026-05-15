// apps/backend/src/modules/product/product.controller.ts
import { Router, Request, Response } from "express";
import type { Router as ExpressRouter } from "express";
import { ProductService } from "./product.service";
import { ProductRepository } from "./product.repository";
import { z } from "zod";

export const productRouter: ExpressRouter = Router();

const productService = new ProductService(new ProductRepository());

const QuerySchema = z.object({
  category: z.string().optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
});

productRouter.get("/", async (req: Request, res: Response) => {
  const query = QuerySchema.safeParse(req.query);
  if (!query.success) {
    return res.status(400).json({
      code: "VALIDATION_ERROR",
      message: "Invalid query parameters",
      details: query.error.flatten(),
    });
  }
  const result = await productService.getProducts(query.data);
  res.json(result);
});

productRouter.get("/:id", async (req: Request, res: Response) => {
  const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  if (!id) {
    return res.status(400).json({ code: "INVALID_ID", message: "Invalid product id" });
  }
  const snapshot = await productService.getProduct(id);
  if (!snapshot) {
    return res.status(404).json({ code: "PRODUCT_NOT_FOUND", message: "Product not found" });
  }
  res.json(snapshot);
});
