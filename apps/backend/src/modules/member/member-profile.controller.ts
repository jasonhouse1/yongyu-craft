import { Router, Request, Response } from "express";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { prisma } from "../../shared/db/prisma";
import { memberAuthMiddleware } from "../../shared/middleware/member-auth.middleware";

export const memberProfileRouter = Router();
memberProfileRouter.use(memberAuthMiddleware);

memberProfileRouter.get("/me", async (req: Request, res: Response) => {
  const memberId = (req as any).member.memberId as string;
  const member = await prisma.member.findUnique({
    where: { id: memberId },
    select: {
      id: true,
      email: true,
      name: true,
      phone: true,
      isVerified: true,
      lastLoginAt: true,
      createdAt: true,
    },
  });
  if (!member) {
    return res
      .status(404)
      .json({ code: "MEMBER_NOT_FOUND", message: "會員不存在" });
  }
  return res.json(member);
});

memberProfileRouter.put("/me", async (req: Request, res: Response) => {
  const memberId = (req as any).member.memberId as string;
  const body = z
    .object({
      name: z.string().min(1).optional(),
      phone: z.string().optional(),
    })
    .safeParse(req.body);
  if (!body.success) {
    return res
      .status(400)
      .json({ code: "VALIDATION_ERROR", details: body.error.flatten() });
  }
  const member = await prisma.member.update({
    where: { id: memberId },
    data: body.data,
    select: { id: true, email: true, name: true, phone: true },
  });
  return res.json(member);
});

memberProfileRouter.put(
  "/change-password",
  async (req: Request, res: Response) => {
    const memberId = (req as any).member.memberId as string;
    const body = z
      .object({
        currentPassword: z.string().min(1),
        newPassword: z.string().min(8),
      })
      .safeParse(req.body);
    if (!body.success) {
      return res
        .status(400)
        .json({ code: "VALIDATION_ERROR", details: body.error.flatten() });
    }
    const member = await prisma.member.findUnique({ where: { id: memberId } });
    if (!member) {
      return res
        .status(404)
        .json({ code: "MEMBER_NOT_FOUND", message: "會員不存在" });
    }
    const valid = await bcrypt.compare(
      body.data.currentPassword,
      member.passwordHash
    );
    if (!valid) {
      return res
        .status(401)
        .json({ code: "INVALID_PASSWORD", message: "目前密碼錯誤" });
    }
    const passwordHash = await bcrypt.hash(body.data.newPassword, 12);
    await prisma.member.update({
      where: { id: memberId },
      data: { passwordHash },
    });
    return res.json({ message: "密碼已更新" });
  }
);

memberProfileRouter.get(
  "/favorites",
  async (req: Request, res: Response) => {
    const memberId = (req as any).member.memberId as string;
    const favs = await prisma.favorite.findMany({
      where: { memberId },
      include: {
        work: {
          select: {
            id: true,
            slug: true,
            titleZh: true,
            categoryId: true,
            coverImage: true,
            priceType: true,
            price: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });
    return res.json({ items: favs.map(f => f.work) });
  }
);

memberProfileRouter.post(
  "/favorites/:workId",
  async (req: Request, res: Response) => {
    const memberId = (req as any).member.memberId as string;
    const workId = req.params.workId as string;
    const work = await prisma.work.findUnique({ where: { id: workId } });
    if (!work) {
      return res
        .status(404)
        .json({ code: "WORK_NOT_FOUND", message: "作品不存在" });
    }
    await prisma.favorite.upsert({
      where: { memberId_workId: { memberId, workId } },
      create: { memberId, workId },
      update: {},
    });
    return res.json({ success: true });
  }
);

memberProfileRouter.delete(
  "/favorites/:workId",
  async (req: Request, res: Response) => {
    const memberId = (req as any).member.memberId as string;
    const workId = req.params.workId as string;
    await prisma.favorite.deleteMany({ where: { memberId, workId } });
    return res.json({ success: true });
  }
);

memberProfileRouter.get(
  "/inquiries",
  async (req: Request, res: Response) => {
    const email = (req as any).member.email as string;
    const inquiries = await prisma.inquiry.findMany({
      where: { email },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        inquiryType: true,
        status: true,
        message: true,
        createdAt: true,
      },
    });
    return res.json({ items: inquiries });
  }
);
