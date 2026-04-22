import { Request, Response } from "express";
import { AuthedRequest } from "../../types/auth.types";
import roomService, {
  RoomServiceError,
} from "../../services/room/room.service";
import authServices from "../../services/auth/auth.services";

function handleRoomError(err: unknown, res: Response) {
  if (err instanceof RoomServiceError) {
    return res.status(err.statusCode).json({ message: err.message });
  }

  console.error(err);
  return res.status(500).json({ message: "Server error" });
}

// createRoom
// * get user from request (from auth middleware)
// * call service
// * send response (roomId, room data)
const createRoom = async (req: AuthedRequest, res: Response) => {
  try {
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const user = await authServices.findUser(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const room = await roomService.create({
      userId: user._id.toString(),
      username: user.username,
    });
    return res.status(201).json(room);
  } catch (err) {
    return handleRoomError(err, res);
  }
};

// joinRoom
// * get roomCode from body/params
// * get user
// * call service
// * return updated room
const joinRoom = async (req: AuthedRequest, res: Response) => {
  try {
    const userId = req.userId;
    const { roomCode } = req.body;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    if (!roomCode) {
      return res.status(400).json({ message: "roomCode is required" });
    }

    const user = await authServices.findUser(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const room = await roomService.join(roomCode, {
      userId: user._id.toString(),
      username: user.username,
    });
    return res.status(200).json(room);
  } catch (err) {
    return handleRoomError(err, res);
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
    return res.status(200).json(room);
  } catch (err) {
    return handleRoomError(err, res);
  }
};

export default { createRoom, joinRoom, getRoomInfo };
