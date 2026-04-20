export type User = { id: string; username: string; email: string };

export type Player = { id: string; username: string };

export type RoomStatus = "waiting" | "full" | "playing" | "finished";

export type Room = {
  roomCode: string;
  players: Player[];
  maxPlayers: number;
  status: RoomStatus;
  createdAt: string;
  hostUserId: string;
};

export type EdgeOrientation = "H" | "V";

export type Edge = {
  id: string;
  orientation: EdgeOrientation;
  row: number;
  col: number;
  claimedBy: string | null;
};

export type Box = {
  id: string;
  row: number;
  col: number;
  claimedBy: string | null;
};

export type GameStatus = "waiting" | "playing" | "finished";

export type GameState = {
  roomId: string;
  boardSize: number;
  players: Player[];
  currentTurnPlayerId: string;
  edges: Edge[];
  boxes: Box[];
  scores: Record<string, number>;
  status: GameStatus;
  winnerPlayerId: string | null;
};

export type AuthResponse = { success: boolean; message: string; user: User };

export type ActivityItem = { id: string; text: string };
