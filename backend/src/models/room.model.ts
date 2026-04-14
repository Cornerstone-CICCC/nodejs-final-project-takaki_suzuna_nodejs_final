type RoomStatus = "waiting" | "full" | "playing";

interface Player {
  userId: string;
  username: string;
}

export interface Room {
  roomId: string;
  players: Player[];
  maxPlayer: number;
  status: RoomStatus;
  createdAt: Date;
}
