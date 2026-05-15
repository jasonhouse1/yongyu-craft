import { Router, Request, Response } from "express";
import type { Router as ExpressRouter } from "express";
import { z } from "zod";
import { prisma } from "../../shared/db/prisma";
import { adminAuthMiddleware } from "../../shared/middleware/admin-auth.middleware";

export const adminWorksRouter: ExpressRouter = Router();
adminWorksRouter.use(adminAuthMiddleware);

const WorkSchema = z.object({
  slug: z.string().min(1),
  titleZh: z.string().min(1),
  titleEn: z.string().optional(),
  subtitleZh: z.string().optional(),
  subtitleEn: z.string().optional(),
  descriptionZh: z.string().min(1),
  descriptionEn: z.string().optional(),
  storyZh: z.string().optional(),
  storyEn: z.string().optional(),
  categoryId: z.string().min(1),
  materials: z.array(z.string()).default([]),
  techniques: z.array(z.string()).default([]),
  dimensions: z.string().optional(),
  year: z.string().optional(),
  priceType: z.enum(["fixed", "range", "inquiry"]).default("inquiry"),
  price: z.number().optional(),
  priceMin: z.number().optional(),
  priceMax: z.number().optional(),
  currency: z.string().default("TWD"),
  isAvailable: z.boolean().default(true),
  isCustomizable: z.boolean().default(false),
  isFeatured: z.boolean().default(false),
  status: z.enum(["draft", "published", "archived"]).default("draft"),
  coverImage: z.string().default(""),
  sortOrder: z.number().int().default(0),
});

const QuerySchema = z.object({
  status: z.enum(["draft", "published", "archived"]).optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
});

// GET /api/admin/works
adminWorksRouter.get("/", async (req: Request, res: Response) => {
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
    prisma.work.findMany({
      where,
      orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
      skip,
      take: limit,
    }),
    prisma.work.count({ where }),
  ]);

  res.json({ items, total, page, limit });
});

// POST /api/admin/works
adminWorksRouter.post("/", async (req: Request, res: Response) => {
  const body = WorkSchema.safeParse(req.body);
  if (!body.success) {
    return res.status(400).json({
      code: "VALIDATION_ERROR",
      details: body.error.flatten(),
    });
  }

  const work = await prisma.work.create({ data: body.data });
  res.status(201).json(work);
});

// PUT /api/admin/works/:id
adminWorksRouter.put("/:id", async (req: Request, res: Response) => {
  const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const body = WorkSchema.partial().safeParse(req.body);
  if (!body.success) {
    return res.status(400).json({
      code: "VALIDATION_ERROR",
      details: body.error.flatten(),
    });
  }

  const existing = await prisma.work.findUnique({ where: { id } });
  if (!existing) {
    return res.status(404).json({ code: "WORK_NOT_FOUND", message: "Work not found" });
  }

  const work = await prisma.work.update({ where: { id }, data: body.data });
  res.json(work);
});

// DELETE /api/admin/works/:id — soft delete
adminWorksRouter.delete("/:id", async (req: Request, res: Response) => {
  const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;

  const existing = await prisma.work.findUnique({ where: { id } });
  if (!existing) {
    return res.status(404).json({ code: "WORK_NOT_FOUND", message: "Work not found" });
  }

  const work = await prisma.work.update({
    where: { id },
    data: { status: "archived" },
  });
  res.json(work);
});
