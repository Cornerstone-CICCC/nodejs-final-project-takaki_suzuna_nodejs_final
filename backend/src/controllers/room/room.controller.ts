import { Request, Response } from "express";
import roomService from "../../services/room/room.service";
// import authMiddleware from "../../middlewares/auth.middleware";

// createRoom
// * get user from request (from auth middleware)
// * call service
// * send response (roomId, room data)
const createRoom = async (req: Request, res: Response) => {
  try {
    const user = req.user;

    if (!user) {
      return res.status(400).json({ message: "Unauthorized" });
    }

    const room = await roomService.create(user);
    res.status(201).json(room);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// joinRoom
// * get roomCode from body/params
// * get user
// * call service
// * return updated room
const joinRoom = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    const { roomCode } = req.body;

    if (!user) {
      return res.status(400).json({ message: "Unauthorized" });
    }
    if (!roomCode) {
      return res.status(400).json({ message: "roomCode is required" });
    }

    const room = await roomService.join(roomCode, user);
    res.status(200).json(room);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// getRoomInfo
// * get roomId
// * call service
// * return room data
const getRoomInfo = async (req: Request, res: Response) => {
  try {
    const { roomCode } = req.params;
    if (!roomCode) {
      return res.status(400).json({ message: "roomCode is required" });
    }

    const room = roomService.roomInfo(roomCode as string);
    res.status(200).json(room);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export default {
  createRoom,
  joinRoom,
  getRoomInfo,
};
