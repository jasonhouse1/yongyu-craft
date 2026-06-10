import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { workRouter } from "./modules/work/work.controller";
import { inquiryRouter } from "./modules/inquiry/inquiry.controller";
import { adminWorksRouter } from "./modules/admin/admin-works.controller";
import { adminInquiriesRouter } from "./modules/admin/admin-inquiries.controller";
import { campaignRouter } from "./modules/campaign/campaign.controller";
import { adminCampaignRouter } from "./modules/campaign/admin-campaign.controller";
import { memberAuthRouter } from "./modules/member/member-auth.controller";
import { memberProfileRouter } from "./modules/member/member-profile.controller";
import { outboxProcessor } from "./shared/outbox/outbox-processor";
import { prisma } from "./shared/db/prisma";

const app = express();
const PORT = process.env.PORT ?? 3000;

app.use(helmet({ contentSecurityPolicy: false }));

app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://localhost:3001',
    process.env.FRONTEND_URL ?? 'https://independent-youth-production-2eba.up.railway.app',
  ],
  credentials: true,
}));

app.use(express.json());

const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { code: 'TOO_MANY_REQUESTS', message: '請求過於頻繁' },
});

const inquiryLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 5,
  message: { code: 'TOO_MANY_REQUESTS', message: '詢價提交過於頻繁' },
});

const adminLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { code: 'TOO_MANY_REQUESTS', message: '嘗試次數過多' },
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { code: 'TOO_MANY_REQUESTS', message: '嘗試次數過多' },
});

app.use('/api', generalLimiter);
app.use('/api/inquiries', inquiryLimiter);
app.use('/api/admin', adminLimiter);
app.use('/api/member/login', authLimiter);
app.use('/api/member/register', authLimiter);

app.get("/health", async (_req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({ status: "ok", db: "connected", uptime: process.uptime() });
  } catch {
    res.status(503).json({ status: "error", db: "disconnected" });
  }
});

app.use("/api/works", workRouter);
app.use("/api/inquiries", inquiryRouter);
app.use("/api/campaigns", campaignRouter);
app.use("/api/admin/works", adminWorksRouter);
app.use("/api/admin/inquiries", adminInquiriesRouter);
app.use("/api/admin/campaigns", adminCampaignRouter);
app.use("/api/member", memberAuthRouter);
app.use("/api/member", memberProfileRouter);

const server = app.listen(PORT, () => {
  console.log(`Backend running at http://localhost:${PORT}`);
  outboxProcessor.start();
});

process.on("SIGTERM", () => {
  outboxProcessor.stop();
  server.close(() => process.exit(0));
});
