export type EdgeOrientation = "H" | "V";

export type Player = {
  id: string;
  username: string;
};

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

export type BoardSize = 6;

export type GameState = {
  roomId: string;
  boardSize: BoardSize;
  players: Player[];
  currentTurnPlayerId: string;
  edges: Edge[];
  boxes: Box[];
  scores: Record<string, number>;
  status: GameStatus;
  winnerPlayerId: string | null;
};
