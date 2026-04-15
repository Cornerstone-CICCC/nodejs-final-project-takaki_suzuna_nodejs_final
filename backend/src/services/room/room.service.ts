import { Player, Room } from "../../models/room/room.model";
import { v4 as uuidv4 } from "uuid";

// Available rooms
type RoomMap = Record<string, Room>;

let rooms: RoomMap = {};

// Create a room
// room code, room object, add creator
const create = (user: { userId: string; username: string }): Room => {
  const player1: Player = {
    userId: user.userId,
    username: user.username,
  };

  const roomCode: string = uuidv4();

  const room: Room = {
    roomCode: roomCode,
    players: [player1],
    maxPlayers: 2,
    status: "waiting",
    createdAt: new Date(),
  };
  rooms[roomCode] = room;
  return room;
};

// Join to the room
const join = (
  roomCode: string,
  user: { userId: string; username: string },
): Room => {
  const player2: Player = {
    userId: user.userId,
    username: user.username,
  };

  const room = rooms[roomCode];
  if (!room) {
    throw new Error("Room not found");
  }
  if (room.players.length >= room.maxPlayers) {
    throw new Error("Room is already full");
  }

  const checkDuplicateUser = room.players.find(
    (player) => player.userId === user.userId,
  );
  if (checkDuplicateUser) {
    throw new Error("You're already in the room");
  }

  room.players.push(player2);
  if (room.maxPlayers === room.players.length) {
    room.status = "full";
  }

  return room;
};

// Get room.info
// return players and status by object
const roomInfo = (roomCode: string) => {
  const room = rooms[roomCode];
  if (!room) {
    throw new Error("Room not found");
  }
  return { players: room.players, status: room.status };
};

export default {
  create,
  join,
  roomInfo,
};
