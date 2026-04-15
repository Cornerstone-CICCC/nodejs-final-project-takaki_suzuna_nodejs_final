type RoomStatus = "waiting" | "full" | "playing";

export interface Player {
  userId: string;
  username: string;
}

export interface Room {
  roomCode: string;
  players: Player[];
  maxPlayers: number;
  status: RoomStatus;
  createdAt: Date;
}
