import { Request, Response, NextFunction } from "express";

export function adminAuthMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const key = req.headers["x-admin-key"];
  if (!key || key !== process.env.ADMIN_SECRET_KEY) {
    res
      .status(401)
      .json({ code: "UNAUTHORIZED", message: "Invalid admin key" });
    return;
  }
  next();
}
