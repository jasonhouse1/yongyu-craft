import { Router, Request, Response } from "express";
import type { Router as ExpressRouter } from "express";
import { WorkService } from "./work.service";
import { WorkRepository } from "./work.repository";
import { prisma } from "../../shared/db/prisma";
import { z } from "zod";

export const workRouter: ExpressRouter = Router();
const workService = new WorkService(new WorkRepository());

const QuerySchema = z.object({
  categoryId: z.string().optional(),
  isFeatured: z.coerce.boolean().optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
});

workRouter.get("/", async (req: Request, res: Response) => {
  const query = QuerySchema.safeParse(req.query);
  if (!query.success) {
    return res.status(400).json({
      code: "VALIDATION_ERROR",
      message: "Invalid query parameters",
      details: query.error.flatten(),
    });
  }
  const result = await workService.getWorks(query.data);
  res.json(result);
});

// featured — max 6, published, sorted by sortOrder
workRouter.get("/featured", async (_req: Request, res: Response) => {
  const items = await workService.getFeaturedWorks(6);
  res.json({ items });
});

// B2: search?q= — must be before /:id
workRouter.get("/search", async (req: Request, res: Response) => {
  const q = typeof req.query.q === "string" ? req.query.q.trim() : "";
  if (!q) {
    return res.json({ items: [] });
  }

  const items = await prisma.work.findMany({
    where: {
      status: "published",
      OR: [
        { titleZh: { contains: q } },
        { titleEn: { contains: q } },
        { descriptionZh: { contains: q } },
      ],
    },
    take: 10,
    orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
    select: { id: true, slug: true, titleZh: true, titleEn: true, categoryId: true, coverImage: true },
  });

  res.json({ items });
});

// B1: id-or-slug lookup + viewCount increment + relatedWorks
workRouter.get("/:id", async (req: Request, res: Response) => {
  const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;

  if (!id) {
    return res.status(400).json({ code: "INVALID_ID", message: "Invalid work id" });
  }

  let snapshot = await workService.getWork(id);
  if (!snapshot) {
    snapshot = await workService.getWorkBySlug(id);
  }

  if (!snapshot) {
    return res.status(404).json({ code: "WORK_NOT_FOUND", message: "Work not found" });
  }

  prisma.work
    .update({ where: { id: snapshot.id }, data: { viewCount: { increment: 1 } } })
    .catch(() => {});

  // B1: fetch 2 related works from same category
  const relatedWorks = await prisma.work.findMany({
    where: {
      categoryId: snapshot.categoryId,
      status: "published",
      id: { not: snapshot.id },
    },
    take: 2,
    orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
    select: { id: true, slug: true, titleZh: true, coverImage: true, categoryId: true },
  });

  res.json({ ...snapshot, relatedWorks });
});
