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

// B2: featured — max 6, published, sorted by sortOrder
workRouter.get("/featured", async (_req: Request, res: Response) => {
  const items = await workService.getFeaturedWorks(6);
  res.json({ items });
});

// B1: id-or-slug lookup + B3: viewCount increment
workRouter.get("/:id", async (req: Request, res: Response) => {
  const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;

  if (!id) {
    return res.status(400).json({ code: "INVALID_ID", message: "Invalid work id" });
  }

  // Try by id first, fall back to slug (B1)
  let snapshot = await workService.getWork(id);
  if (!snapshot) {
    snapshot = await workService.getWorkBySlug(id);
  }

  if (!snapshot) {
    return res.status(404).json({ code: "WORK_NOT_FOUND", message: "Work not found" });
  }

  // B3: increment viewCount asynchronously, silent fail
  prisma.work
    .update({ where: { id: snapshot.id }, data: { viewCount: { increment: 1 } } })
    .catch(() => {});

  res.json(snapshot);
});
