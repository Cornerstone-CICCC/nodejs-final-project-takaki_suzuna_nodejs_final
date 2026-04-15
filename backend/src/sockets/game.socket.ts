import jwt from "jsonwebtoken";
import { Server, type Socket } from "socket.io";
import env from "../config/env";
import authServices from "../services/auth/auth.services";
import roomService from "../services/room/room.service";
import { createInitialGameState } from "../utils/board";
import { GameLogicError, applyMove } from "../utils/gameLogic";
import {
  type GameState,
  type Player,
} from "../types/game.types";
import { type Room as RoomState } from "../models/room/room.model";

type SocketUser = Player;

type AuthenticatedSocket = Socket & {
  data: Socket["data"] & { user?: SocketUser };
};

type JoinRoomPayload = { roomCode: string };

type MakeMovePayload = { roomCode: string; edgeId: string };

export const activeRooms = new Map<string, RoomState>();
export const activeGames = new Map<string, GameState>();

function parseCookies(cookieHeader?: string): Record<string, string> {
  if (!cookieHeader) {
    return {};
  }
  // session=abc123; theme=dark; lang=en

  return cookieHeader
    .split(";")
    .reduce<Record<string, string>>((cookies, entry) => {
      const [rawName, ...rawValueParts] = entry.trim().split("=");
      // "session=abc=123".split("=")
      // becomes:
      // rawName = "session"
      // rawValueParts = ["abc", "123"]
      if (!rawName) {
        return cookies;
      }

      cookies[rawName] = decodeURIComponent(rawValueParts.join("="));
      return cookies;
    }, {});
}

async function getSocketUser(socket: Socket): Promise<SocketUser | null> {
  const cookies = parseCookies(socket.handshake.headers.cookie);
  // socket.handshake.headers.cookie is the standard way for a server to access cookies sent by a client during the initial WebSocket handshake

  const token = cookies.session;

  if (!token) {
    return null;
  }

  try {
    const payload = jwt.verify(token, env.JWT_SECRET_KEY) as { userId: string };
    const user = await authServices.findUser(payload.userId);

    if (!user) {
      return null;
    }

    return { id: user.id, username: user.username }; // This is the player info front-end needs
  } catch {
    return null;
  }
}

function emitRoomState(io: Server, roomCode: string, room: RoomState) {
  io.to(roomCode).emit("room:joined", room);
}

function getRoomOrEmitError(
  socket: AuthenticatedSocket,
  roomCode: string,
): RoomState | null {
  const room = activeRooms.get(roomCode);

  if (!room) {
    socket.emit("room:error", { message: "Room does not exist" });
    return null;
  }

  return room;
}

function assertAuthenticatedUser(socket: AuthenticatedSocket): SocketUser {
  const user = socket.data.user;

  if (!user) {
    throw new Error("Unauthorized socket connection");
  }

  return user;
}

function syncActiveRoom(room: RoomState | null) {
  if (!room) {
    return;
  }

  activeRooms.set(room.roomCode, room);
}

async function handleRoomDisconnect(
  io: Server,
  socket: AuthenticatedSocket,
  user: SocketUser,
) {
  const joinedRoomCodes = [...socket.rooms].filter((room) => room !== socket.id);

  for (const roomCode of joinedRoomCodes) {
    const normalizedRoomCode = roomService.normalizeCode(roomCode);
    const socketsInRoom = await io.in(normalizedRoomCode).fetchSockets();
    const hasSameUserConnectedElsewhere = socketsInRoom.some(
      (roomSocket) => {
        const remoteUser = roomSocket.data.user as SocketUser | undefined;
        return roomSocket.id !== socket.id && remoteUser?.id === user.id;
      },
    );

    if (hasSameUserConnectedElsewhere) {
      continue;
    }

    const updatedRoom = roomService.removePlayer(normalizedRoomCode, user.id);

    if (!updatedRoom) {
      activeRooms.delete(normalizedRoomCode);
      activeGames.delete(normalizedRoomCode);
      continue;
    }

    syncActiveRoom(updatedRoom);

    if (activeGames.has(normalizedRoomCode)) {
      activeGames.delete(normalizedRoomCode);
      roomService.updateStatus(normalizedRoomCode, "waiting");
      const resetRoom = roomService.roomInfo(normalizedRoomCode);
      syncActiveRoom(resetRoom);
      io.to(normalizedRoomCode).emit("game:error", {
        message: "A player disconnected. The game has been reset.",
      });
      emitRoomState(io, normalizedRoomCode, resetRoom);
      continue;
    }

    io.to(normalizedRoomCode).emit("room:player_left", {
      roomCode: normalizedRoomCode,
      userId: user.id,
      players: updatedRoom.players,
    });
    emitRoomState(io, normalizedRoomCode, updatedRoom);
  }
}

export function registerGameSocketHandlers(io: Server) {
  io.use(async (socket, next) => {
    const user = await getSocketUser(socket); // authencticate based on jwt token attached in websocket cookies

    if (!user) {
      next(new Error("Unauthorized"));
      return;
    }

    (socket as AuthenticatedSocket).data.user = user;
    next();
  });

  io.on("connection", (socket) => {
    const authedSocket = socket as AuthenticatedSocket;

    authedSocket.on("room:join", ({ roomCode }: JoinRoomPayload) => {
      const user = assertAuthenticatedUser(authedSocket);
      const normalizedRoomCode = roomCode?.trim().toUpperCase();

      if (!normalizedRoomCode) {
        authedSocket.emit("room:error", { message: "Room code is required" });
        return;
      }

      const wasAlreadyInRoom = roomService.isPlayerAlreadyInRoom(
        normalizedRoomCode,
        user.id,
      );

      try {
        const updatedRoom = roomService.joinOrCreate(normalizedRoomCode, {
          userId: user.id,
          username: user.username,
        });

        syncActiveRoom(updatedRoom);
        authedSocket.join(normalizedRoomCode);
        authedSocket.emit("room:joined", updatedRoom);

        if (!wasAlreadyInRoom) {
          authedSocket.to(normalizedRoomCode).emit("room:player_joined", {
            roomCode: normalizedRoomCode,
            player: user,
            players: updatedRoom.players,
          });
        }
      } catch (error) {
        const message = error instanceof Error ? error.message : "Unable to join room";
        authedSocket.emit("room:error", { message });
      }
    });

    authedSocket.on("game:start", ({ roomCode }: JoinRoomPayload) => {
      // When the game starts
      const user = assertAuthenticatedUser(authedSocket);
      const normalizedRoomCode = roomCode?.trim().toUpperCase();
      const room = getRoomOrEmitError(authedSocket, normalizedRoomCode);

      if (!room) {
        return;
      }

      if (room.hostUserId !== user.id) {
        authedSocket.emit("game:error", {
          message: "Only the host can start the game",
        });
        return;
      }

      if (room.players.length !== 2) {
        authedSocket.emit("game:error", {
          message: "Two players must join before the game can start",
        });
        return;
      }

      const gameState = createInitialGameState(
        normalizedRoomCode,
        room.players,
      );
      // {
      // roomId,boardSize,
      // players: players.map((player) => ({ ...player })),
      // currentTurnPlayerId:
      // players[0].id,edges: [...createHorizontalEdges(boardSize),..createVerticalEdges(boardSize),],
      // boxes: createBoxes(boardSize),
      // scores: createInitialScores(players),
      // status: "playing",
      // winnerPlayerId: null,};
      activeGames.set(normalizedRoomCode, gameState);

      const updatedRoom = roomService.updateStatus(normalizedRoomCode, "playing");
      syncActiveRoom(updatedRoom);

      io.to(normalizedRoomCode).emit("game:started", gameState);
    });

    authedSocket.on(
      "game:make_move",
      ({ roomCode, edgeId }: MakeMovePayload) => {
        const user = assertAuthenticatedUser(authedSocket);
        const normalizedRoomCode = roomCode?.trim().toUpperCase();
        const gameState = activeGames.get(normalizedRoomCode);

        if (!gameState) {
          authedSocket.emit("game:error", { message: "Game has not started" });
          return;
        }

        try {
          const updatedState = applyMove(gameState, user.id, edgeId);
          activeGames.set(normalizedRoomCode, updatedState);

          io.to(normalizedRoomCode).emit("game:state_updated", updatedState);

          if (updatedState.status === "finished") {
            const room = activeRooms.get(normalizedRoomCode);

            if (room) {
              const updatedRoom = roomService.updateStatus(
                normalizedRoomCode,
                "finished",
              );
              syncActiveRoom(updatedRoom);
            }

            io.to(normalizedRoomCode).emit("game:finished", updatedState);
          }
        } catch (error) {
          const message =
            error instanceof GameLogicError
              ? error.message
              : "Unable to process move";

          authedSocket.emit("game:error", { message });
        }
      },
    );

    authedSocket.on("disconnecting", () => {
      const user = authedSocket.data.user;

      if (!user) {
        return;
      }

      void handleRoomDisconnect(io, authedSocket, user);
    });
  });
}
