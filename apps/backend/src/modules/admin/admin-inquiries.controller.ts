import { Router, Request, Response } from "express";
import type { Router as ExpressRouter } from "express";
import { z } from "zod";
import { prisma } from "../../shared/db/prisma";
import { adminAuthMiddleware } from "../../shared/middleware/admin-auth.middleware";

export const adminInquiriesRouter: ExpressRouter = Router();
adminInquiriesRouter.use(adminAuthMiddleware);

const INQUIRY_STATUSES = [
  "newInquiry",
  "pending",
  "replied",
  "contacted",
  "negotiating",
  "completed",
  "closed",
] as const;

const QuerySchema = z.object({
  status: z.enum(INQUIRY_STATUSES).optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
});

const UpdateStatusSchema = z.object({
  status: z.enum(INQUIRY_STATUSES),
  adminNote: z.string().optional(),
});

// GET /api/admin/inquiries
adminInquiriesRouter.get("/", async (req: Request, res: Response) => {
  const query = QuerySchema.safeParse(req.query);
  if (!query.success) {
    return res.status(400).json({
      code: "VALIDATION_ERROR",
      details: query.error.flatten(),
    });
  }

  const { status, page, limit } = query.data;
  const skip = (page - 1) * limit;
  const where = status ? { status } : {};

  const [items, total] = await Promise.all([
    prisma.inquiry.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    }),
    prisma.inquiry.count({ where }),
  ]);

  res.json({ items, total, page, limit });
});

// PUT /api/admin/inquiries/:id/status
adminInquiriesRouter.put("/:id/status", async (req: Request, res: Response) => {
  const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const body = UpdateStatusSchema.safeParse(req.body);
  if (!body.success) {
    return res.status(400).json({
      code: "VALIDATION_ERROR",
      details: body.error.flatten(),
    });
  }

  const existing = await prisma.inquiry.findUnique({ where: { id: id! } });
  if (!existing) {
    return res.status(404).json({
      code: "INQUIRY_NOT_FOUND",
      message: "Inquiry not found",
    });
  }

  const { status, adminNote } = body.data;
  const inquiry = await prisma.inquiry.update({
    where: { id: id! },
    data: {
      status,
      adminNote: adminNote ?? undefined,
      repliedAt:
        status === "replied" || status === "contacted" ? new Date() : undefined,
    },
  });

  res.json(inquiry);
});
