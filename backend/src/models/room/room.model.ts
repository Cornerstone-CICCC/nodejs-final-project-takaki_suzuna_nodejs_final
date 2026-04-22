export type RoomStatus = "waiting" | "full" | "playing" | "finished";

export interface Player {
  id: string;
  username: string;
}

export interface Room {
  roomCode: string;
  players: Player[];
  maxPlayers: number;
  status: RoomStatus;
  createdAt: Date;
  hostUserId: string;
}
