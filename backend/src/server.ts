import express from "express";
import mongoose from "mongoose";
import env from "./config/env";
import cookieParser from "cookie-parser";
import authRouter from "./routes/auth/auth.routes";
import http from "http";
import { Server } from "socket.io";
import { registerGameSocketHandlers } from "./sockets/game.socket";

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use("/auth", authRouter);

const server = http.createServer(app);
const io = new Server(server);
registerGameSocketHandlers(io);

const PORT = env.PORT;
const MONGO_DB = env.DATABASE_URL;

if (!MONGO_DB) {
  throw new Error("Missing connection string");
}

mongoose
  .connect(MONGO_DB, { dbName: "dots_and_box" })
  .then(() => {
    console.log("\r\nMongoDB connected");
    server.listen(PORT, () => {
      console.log(`Server is listening on port ${PORT}\r\n`);
    });
  })
  .catch((e) => {
    console.log(e);
    throw new Error(e);
  });
