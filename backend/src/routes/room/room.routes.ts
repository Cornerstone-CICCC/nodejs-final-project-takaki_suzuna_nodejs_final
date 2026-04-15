import { Router } from "express";
import roomController from "../../controllers/room/room.controller";
import authMiddleware from "../../middlewares/auth.middleware";

const roomRouter = Router();

roomRouter.post("/", authMiddleware, roomController.createRoom);
roomRouter.post("/", authMiddleware, roomController.createRoom);
roomRouter.get("/:roomCode", roomController.getRoomInfo);

export default roomRouter;
