import "./shared/events/event-logger"; // 初始化事件系統（logger）
import "./modules/product/product-snapshot-subscriber"; // Phase 2.3-2：事件 → Snapshot

import express from "express";
import { productRouter } from "./modules/product/product.controller";

const app = express();
const PORT = 3000;

app.use(express.json());

// Health check
app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

// Product APIs
app.use("/api/v1/products", productRouter);

app.listen(PORT, () => {
  console.log(`🚀 Backend server running at http://localhost:${PORT}`);
});
