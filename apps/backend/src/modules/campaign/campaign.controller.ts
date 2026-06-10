import { Router, Request, Response } from "express";
import type { Router as ExpressRouter } from "express";
import { prisma } from "../../shared/db/prisma";

export const campaignRouter: ExpressRouter = Router();

// GET /api/campaigns/active
campaignRouter.get("/active", async (_req: Request, res: Response) => {
  const now = new Date();

  const campaign = await prisma.campaign.findFirst({
    where: {
      isActive: true,
      OR: [{ startDate: null }, { startDate: { lte: now } }],
      AND: [{ OR: [{ endDate: null }, { endDate: { gte: now } }] }],
    },
    orderBy: { createdAt: "desc" },
  });

  res.json({ campaign: campaign ?? null });
});
