import mongoose, { Document, Schema } from "mongoose";

export interface IUser extends Document {
  username: string;
  passwordHash: string;
  email: string;
}

const UserSchema: Schema = new Schema({
  username: { type: String, required: true },
  email: { type: String, required: true },
  passwordHash: { type: String, required: true },
});

export const User = mongoose.model<IUser>("User", UserSchema);
