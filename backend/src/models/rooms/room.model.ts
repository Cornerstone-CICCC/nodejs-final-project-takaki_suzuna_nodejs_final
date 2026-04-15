import mongoose, { Document, Schema } from "mongoose";

export interface IRoom extends Document {
  code: string;
  hostUserId: string;
  playerIds: string[];
  status: string;
}

const RoomSchema: Schema = new Schema({ code: { type: String } });
