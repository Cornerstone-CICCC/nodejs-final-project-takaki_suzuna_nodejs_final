import { Router } from "express";
import authController from "../../controllers/auth.controller";
import authMiddleware from "../../middlewares/auth.middleware";

const authRouter = Router();

authRouter.post("/signup", authController.signup);
authRouter.post("/login", authController.login);
authRouter.post("/logout", authController.logout);
authRouter.get("/me", authMiddleware, authController.getMe);

export default authRouter;
