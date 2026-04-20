import mongoose, { Document, Schema } from "mongoose";

export interface IRoom extends Document {
  code: string;
  hostUserId: string;
  playerIds: string[];
  status: string;
  maxPlayers: number;
  createdAt: Date;
}

const RoomSchema: Schema = new Schema({
  code: { type: String, required: true, unique: true, trim: true, uppercase: true },
  hostUserId: { type: String, required: true },
  playerIds: { type: [String], required: true, default: [] },
  status: { type: String, required: true, default: "waiting" },
  maxPlayers: { type: Number, required: true, default: 2 },
  createdAt: { type: Date, required: true, default: Date.now },
});

export const Room = mongoose.model<IRoom>("Room", RoomSchema);
