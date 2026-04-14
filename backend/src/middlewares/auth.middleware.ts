import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import env from "../config/env";
import { AuthedRequest, JwtPayload } from "../types/auth.types";

export default function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const token = req.cookies?.session;

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const payload = jwt.verify(token, env.JWT_SECRET_KEY) as JwtPayload;
    (req as AuthedRequest).userId = payload.userId;
    next();
  } catch {
    return res.status(401).json({ message: "Invalid or expired session" });
  }
}
