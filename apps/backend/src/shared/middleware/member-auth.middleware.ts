import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../auth/jwt";

export function memberAuthMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const auth = req.headers.authorization;
  if (!auth?.startsWith("Bearer ")) {
    res.status(401).json({ code: "UNAUTHORIZED", message: "請先登入" });
    return;
  }
  const token = auth.slice(7);
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    (req as any).member = payload;
    next();
  } catch {
    res.status(401).json({ code: "TOKEN_EXPIRED", message: "登入已過期" });
  }
}
