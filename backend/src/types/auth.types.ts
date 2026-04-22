import { Request } from "express";

export interface AuthedRequest extends Request {
  userId?: string;
}

export type JwtPayload = { userId: string };
