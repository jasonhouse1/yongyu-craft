import { Product } from "./product.types";

/**
 * Mock Products
 * ----------------------------------------------------
 * 模擬資料來源（未來可替換為 DB / Prisma）
 */
export const mockProducts: Product[] = [
  {
    id: "p-001",
    name: "永裕工藝 · 經典戒指",
    price: 128000,
    currency: "TWD",
  },
  {
    id: "p-002",
    name: "永裕工藝 · 手工項鍊",
    price: 256000,
    currency: "TWD",
  },
];
