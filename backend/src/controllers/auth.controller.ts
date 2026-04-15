import { Request, Response } from "express";
import bcrypt from "bcrypt";
import zxcvbn from "zxcvbn";
import authServices from "../services/auth/auth.services";
import hashPassword from "../utils/hashPw";
import env from "../config/env";
import jwt from "jsonwebtoken";
import { AuthedRequest } from "../types/auth.types";

const COOKIE_NAME = "session";
const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: false,
  sameSite: "lax" as const,
};

function createToken(userId: string) {
  return jwt.sign({ userId }, env.JWT_SECRET_KEY, { expiresIn: "7d" });
}

function sanitizeUser(user: { id: string; username: string; email: string }) {
  return { id: user.id, username: user.username, email: user.email };
}

// ##########################################################################################
//                                      SIGN UP
// ##########################################################################################

async function signup(req: Request, res: Response) {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    return res.status(400).json({ message: "Missing one of the credentials" });
  }

  const score = zxcvbn(password).score;
  if (score <= 2) {
    return res.status(400).json("Password is weak");
  }

  const hashedPw = await hashPassword(password, env.SALT);

  try {
    const existingUser = await authServices.findUserByEmail(email);
    if (existingUser) {
      return res.status(409).json({ message: "Email is already in use" });
    }

    const addedUser = await authServices.insertUser({
      username,
      email,
      passwordHash: hashedPw,
    });
    const token = createToken(addedUser.id);

    res.cookie(COOKIE_NAME, token, COOKIE_OPTIONS);

    return res
      .status(201)
      .json({
        success: true,
        message: "User successfully created",
        user: sanitizeUser(addedUser),
      });
  } catch (e) {
    console.log(e);
    return res.status(500).json({ message: "Server Error" });
  }
}

// ##########################################################################################
//                                      LOGIN
// ##########################################################################################

async function login(req: Request, res: Response) {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: "Missing one of the credentials" });
  }

  try {
    const existingUser = await authServices.findUserByEmail(email);
    if (!existingUser) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const matched = await bcrypt.compare(password, existingUser.passwordHash);
    if (!matched) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = createToken(existingUser.id);

    res.cookie(COOKIE_NAME, token, COOKIE_OPTIONS);

    return res
      .status(200)
      .json({
        success: true,
        message: "Login successful",
        user: sanitizeUser(existingUser),
      });
  } catch (e) {
    console.log(e);
    return res.status(500).json({ message: "Server Error" });
  }
}

// ##########################################################################################
//                                      LOGOUT
// ##########################################################################################
async function logout(req: Request, res: Response) {
  res.clearCookie(COOKIE_NAME, COOKIE_OPTIONS);
  return res.status(200).json({ success: true, message: "Logged out" });
}

// ##########################################################################################
//                                      GET ME
// ##########################################################################################
async function getMe(req: AuthedRequest, res: Response) {
  try {
    if (!req.userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const user = await authServices.findUser(req.userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({ success: true, user: sanitizeUser(user) });
  } catch (e) {
    console.log(e);
    return res.status(500).json({ message: "Server Error" });
  }
}

export default { signup, login, logout, getMe };
