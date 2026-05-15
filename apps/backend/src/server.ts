import "dotenv/config";
import express from "express";
import { workRouter } from "./modules/work/work.controller";
import { inquiryRouter } from "./modules/inquiry/inquiry.controller";
import { outboxProcessor } from "./shared/outbox/outbox-processor";

const app = express();
const PORT = process.env.PORT ?? 3000;

app.use(express.json());

app.use((req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("X-XSS-Protection", "1; mode=block");
  next();
});

app.get("/health", (_req, res) => {
  res.json({
    status: "ok",
    uptime: process.uptime(),
    version: "1.0.0",
  });
});

app.use("/api/works", workRouter);
app.use("/api/inquiries", inquiryRouter);

const server = app.listen(PORT, () => {
  console.log(`Backend running at http://localhost:${PORT}`);
  outboxProcessor.start();
});

process.on("SIGTERM", () => {
  outboxProcessor.stop();
  server.close(() => process.exit(0));
});
