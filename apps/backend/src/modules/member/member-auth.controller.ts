import { Router, Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { z } from "zod";
import { randomBytes } from "crypto";
import { Resend } from "resend";
import { prisma } from "../../shared/db/prisma";

export const memberAuthRouter = Router();

const JWT_SECRET = process.env.JWT_SECRET ?? "yongyu-craft-jwt-2026";
const BACKEND_URL = process.env.BACKEND_URL ?? "http://localhost:3000";
const FRONTEND_URL = process.env.FRONTEND_URL ?? "http://localhost:3001";
const FROM = process.env.RESEND_FROM_EMAIL ?? "onboarding@resend.dev";

function getResend(): Resend | null {
  const key = process.env.RESEND_API_KEY;
  return key ? new Resend(key) : null;
}

const RegisterSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().optional(),
  honeypot: z.string().max(0).optional(),
});

const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

memberAuthRouter.post("/register", async (req: Request, res: Response) => {
  const body = RegisterSchema.safeParse(req.body);
  if (!body.success) {
    return res
      .status(400)
      .json({ code: "VALIDATION_ERROR", details: body.error.flatten() });
  }
  const { email, password, name, honeypot } = body.data;
  if (honeypot) return res.json({ message: "請檢查信箱完成驗證" });

  const existing = await prisma.member.findUnique({ where: { email } });
  if (existing) {
    return res
      .status(409)
      .json({ code: "EMAIL_EXISTS", message: "此 Email 已被註冊" });
  }

  const passwordHash = await bcrypt.hash(password, 12);
  const verifyToken = randomBytes(32).toString("hex");

  await prisma.member.create({
    data: { email, passwordHash, name, isVerified: false, verifyToken },
  });

  const verifyUrl = `${BACKEND_URL}/api/member/verify?token=${verifyToken}`;
  const resend = getResend();
  if (resend) {
    resend.emails
      .send({
        from: FROM,
        to: email,
        subject: "永裕工藝 · 驗證您的信箱",
        html: `<p style="font-family:serif">歡迎加入永裕工藝會員。<br><br>請點擊以下連結完成信箱驗證：<br><br><a href="${verifyUrl}">${verifyUrl}</a><br><br>連結有效期為 24 小時。</p>`,
      })
      .catch(() => {});
  }

  return res.status(201).json({ message: "請檢查信箱完成驗證" });
});

memberAuthRouter.post("/login", async (req: Request, res: Response) => {
  const body = LoginSchema.safeParse(req.body);
  if (!body.success) {
    return res
      .status(400)
      .json({ code: "VALIDATION_ERROR", details: body.error.flatten() });
  }
  const { email, password } = body.data;

  const member = await prisma.member.findUnique({ where: { email } });
  if (!member) {
    return res
      .status(401)
      .json({ code: "INVALID_CREDENTIALS", message: "Email 或密碼錯誤" });
  }
  if (!member.isVerified) {
    return res
      .status(403)
      .json({ code: "NOT_VERIFIED", message: "請先驗證信箱" });
  }

  const valid = await bcrypt.compare(password, member.passwordHash);
  if (!valid) {
    return res
      .status(401)
      .json({ code: "INVALID_CREDENTIALS", message: "Email 或密碼錯誤" });
  }

  const token = jwt.sign(
    { memberId: member.id, email: member.email, name: member.name },
    JWT_SECRET,
    { expiresIn: "7d" }
  );

  await prisma.member.update({
    where: { id: member.id },
    data: { lastLoginAt: new Date() },
  });

  return res.json({
    token,
    member: { id: member.id, email: member.email, name: member.name },
  });
});

memberAuthRouter.get("/verify", async (req: Request, res: Response) => {
  const token =
    typeof req.query.token === "string" ? req.query.token : "";
  if (!token) {
    return res
      .status(400)
      .json({ code: "INVALID_TOKEN", message: "無效的驗證連結" });
  }

  const member = await prisma.member.findFirst({
    where: { verifyToken: token },
  });
  if (!member) {
    return res
      .status(400)
      .json({ code: "INVALID_TOKEN", message: "驗證連結已失效" });
  }

  await prisma.member.update({
    where: { id: member.id },
    data: { isVerified: true, verifyToken: null },
  });

  return res.redirect(`${FRONTEND_URL}/member?verified=true`);
});

memberAuthRouter.post(
  "/forgot-password",
  async (req: Request, res: Response) => {
    const body = z
      .object({ email: z.string().email() })
      .safeParse(req.body);
    if (!body.success) {
      return res
        .status(400)
        .json({ code: "VALIDATION_ERROR", details: body.error.flatten() });
    }

    const member = await prisma.member.findUnique({
      where: { email: body.data.email },
    });
    if (!member) return res.json({ message: "重設密碼連結已寄出" });

    const resetToken = randomBytes(32).toString("hex");
    const resetTokenExp = new Date(Date.now() + 3600000);

    await prisma.member.update({
      where: { id: member.id },
      data: { resetToken, resetTokenExp },
    });

    const resetUrl = `${FRONTEND_URL}/member/reset-password?token=${resetToken}`;
    const resend = getResend();
    if (resend) {
      resend.emails
        .send({
          from: FROM,
          to: body.data.email,
          subject: "永裕工藝 · 重設密碼",
          html: `<p style="font-family:serif">您的重設密碼連結（1 小時內有效）：<br><br><a href="${resetUrl}">${resetUrl}</a></p>`,
        })
        .catch(() => {});
    }

    return res.json({ message: "重設密碼連結已寄出" });
  }
);

memberAuthRouter.post(
  "/reset-password",
  async (req: Request, res: Response) => {
    const body = z
      .object({ token: z.string(), password: z.string().min(8) })
      .safeParse(req.body);
    if (!body.success) {
      return res
        .status(400)
        .json({ code: "VALIDATION_ERROR", details: body.error.flatten() });
    }
    const { token, password } = body.data;

    const member = await prisma.member.findFirst({
      where: { resetToken: token, resetTokenExp: { gte: new Date() } },
    });
    if (!member) {
      return res
        .status(400)
        .json({ code: "INVALID_TOKEN", message: "重設連結已失效" });
    }

    const passwordHash = await bcrypt.hash(password, 12);
    await prisma.member.update({
      where: { id: member.id },
      data: { passwordHash, resetToken: null, resetTokenExp: null },
    });

    return res.json({ message: "密碼已重設，請重新登入" });
  }
);
