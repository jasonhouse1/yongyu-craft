import { Router, Request, Response } from "express";
import type { Router as ExpressRouter } from "express";
import { z } from "zod";
import { prisma } from "../../shared/db/prisma";
import { adminAuthMiddleware } from "../../shared/middleware/admin-auth.middleware";

export const adminCampaignRouter: ExpressRouter = Router();
adminCampaignRouter.use(adminAuthMiddleware);

const CampaignSchema = z.object({
  title: z.string().min(1),
  subtitle: z.string().optional(),
  ctaText: z.string().optional(),
  ctaUrl: z.string().optional(),
  isActive: z.boolean().default(false),
  startDate: z.coerce.date().optional().nullable(),
  endDate: z.coerce.date().optional().nullable(),
  bgColor: z.string().default("#080706"),
  accentColor: z.string().default("#C49A5A"),
});

// GET /api/admin/campaigns
adminCampaignRouter.get("/", async (_req: Request, res: Response) => {
  const items = await prisma.campaign.findMany({
    orderBy: { createdAt: "desc" },
  });
  res.json({ items });
});

// POST /api/admin/campaigns
adminCampaignRouter.post("/", async (req: Request, res: Response) => {
  const body = CampaignSchema.safeParse(req.body);
  if (!body.success) {
    return res.status(400).json({ code: "VALIDATION_ERROR", details: body.error.flatten() });
  }
  const campaign = await prisma.campaign.create({ data: body.data });
  res.status(201).json(campaign);
});

// GET /api/admin/campaigns/:id
adminCampaignRouter.get("/:id", async (req: Request, res: Response) => {
  const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const campaign = await prisma.campaign.findUnique({ where: { id } });
  if (!campaign) {
    return res.status(404).json({ code: "CAMPAIGN_NOT_FOUND", message: "Campaign not found" });
  }
  res.json(campaign);
});

// PUT /api/admin/campaigns/:id
adminCampaignRouter.put("/:id", async (req: Request, res: Response) => {
  const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const body = CampaignSchema.partial().safeParse(req.body);
  if (!body.success) {
    return res.status(400).json({ code: "VALIDATION_ERROR", details: body.error.flatten() });
  }
  const existing = await prisma.campaign.findUnique({ where: { id } });
  if (!existing) {
    return res.status(404).json({ code: "CAMPAIGN_NOT_FOUND", message: "Campaign not found" });
  }
  const campaign = await prisma.campaign.update({ where: { id }, data: body.data });
  res.json(campaign);
});

// DELETE /api/admin/campaigns/:id
adminCampaignRouter.delete("/:id", async (req: Request, res: Response) => {
  const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const existing = await prisma.campaign.findUnique({ where: { id } });
  if (!existing) {
    return res.status(404).json({ code: "CAMPAIGN_NOT_FOUND", message: "Campaign not found" });
  }
  await prisma.campaign.delete({ where: { id } });
  res.json({ success: true });
});
