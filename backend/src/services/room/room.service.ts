import { Player, Room, RoomStatus } from "../../models/room/room.model";
import { v4 as uuidv4 } from "uuid";

type RoomMap = Map<string, Room>;
type UserInput = { userId: string; username: string };

const MAX_PLAYERS = 2;
const rooms: RoomMap = new Map();

export class RoomServiceError extends Error {
  statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.name = "RoomServiceError";
    this.statusCode = statusCode;
  }
}

function normalizeRoomCode(roomCode: string): string {
  return roomCode.trim().toUpperCase();
}

function toPlayer(user: UserInput): Player {
  return { id: user.userId, username: user.username };
}

function buildRoom(roomCode: string, host: Player): Room {
  return {
    roomCode,
    players: [host],
    maxPlayers: MAX_PLAYERS,
    status: "waiting",
    createdAt: new Date(),
    hostUserId: host.id,
  };
}

function getRoomOrThrow(roomCode: string): Room {
  const room = rooms.get(normalizeRoomCode(roomCode));

  if (!room) {
    throw new RoomServiceError("Room not found", 404);
  }

  return room;
}

const create = (user: UserInput): Room => {
  const roomCode = uuidv4().toUpperCase();
  const room = buildRoom(roomCode, toPlayer(user));
  rooms.set(roomCode, room);
  return room;
};

const createWithCode = (roomCode: string, user: UserInput): Room => {
  const normalizedRoomCode = normalizeRoomCode(roomCode);

  if (rooms.has(normalizedRoomCode)) {
    throw new RoomServiceError("Room already exists", 409);
  }

  const room = buildRoom(normalizedRoomCode, toPlayer(user));
  rooms.set(normalizedRoomCode, room);
  return room;
};

const join = (roomCode: string, user: UserInput): Room => {
  const room = getRoomOrThrow(roomCode);
  const existingPlayer = room.players.find(
    (player) => player.id === user.userId,
  );

  if (existingPlayer) {
    return room;
  }

  if (room.players.length >= room.maxPlayers) {
    throw new RoomServiceError("Room is already full", 409);
  }

  room.players.push(toPlayer(user));
  room.status = room.players.length >= room.maxPlayers ? "full" : "waiting";

  return room;
};

const joinOrCreate = (roomCode: string, user: UserInput): Room => {
  const normalizedRoomCode = normalizeRoomCode(roomCode);
  const existingRoom = rooms.get(normalizedRoomCode);

  if (!existingRoom) {
    return createWithCode(normalizedRoomCode, user);
  }

  return join(normalizedRoomCode, user);
};

const roomInfo = (roomCode: string): Room => getRoomOrThrow(roomCode);

const updateStatus = (roomCode: string, status: RoomStatus): Room => {
  const room = getRoomOrThrow(roomCode);
  room.status = status;
  return room;
};

const removePlayer = (roomCode: string, userId: string): Room | null => {
  const normalizedRoomCode = normalizeRoomCode(roomCode);
  const room = rooms.get(normalizedRoomCode);

  if (!room) {
    return null;
  }

  room.players = room.players.filter((player) => player.id !== userId);

  if (room.players.length === 0) {
    rooms.delete(normalizedRoomCode);
    return null;
  }

  if (room.hostUserId === userId) {
    room.hostUserId = room.players[0].id;
  }

  if (room.status !== "finished") {
    room.status = room.players.length >= room.maxPlayers ? "full" : "waiting";
  }

  return room;
};

const deleteRoom = (roomCode: string): void => {
  rooms.delete(normalizeRoomCode(roomCode));
};

const hasRoom = (roomCode: string): boolean =>
  rooms.has(normalizeRoomCode(roomCode));

const listRooms = (): Room[] => Array.from(rooms.values());

const isRoomServiceError = (error: unknown): error is RoomServiceError =>
  error instanceof RoomServiceError;

const normalizeCode = (roomCode: string): string => normalizeRoomCode(roomCode);

const isPlayerAlreadyInRoom = (roomCode: string, userId: string): boolean => {
  const room = rooms.get(normalizeRoomCode(roomCode));
  return room ? room.players.some((player) => player.id === userId) : false;
};

export default {
  create,
  createWithCode,
  join,
  joinOrCreate,
  roomInfo,
  updateStatus,
  removePlayer,
  deleteRoom,
  hasRoom,
  listRooms,
  isRoomServiceError,
  normalizeCode,
  isPlayerAlreadyInRoom,
};
