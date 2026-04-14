import { Request, Response } from "express";
import zxcvbn from "zxcvbn";
import authServices from "../services/auth/auth.services";
import hashPassword from "../utils/hashPw";
import env from "../config/env";
import jwt from "jsonwebtoken";

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
    const addedUser = await authServices.insertUser({
      username,
      email,
      passwordHash: hashedPw,
    });
    const userId = addedUser.id;
    const token = jwt.sign({ userId: userId }, env.JWT_SECRET_KEY, {
      expiresIn: "7d",
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: "Server Error" });
  }
}
