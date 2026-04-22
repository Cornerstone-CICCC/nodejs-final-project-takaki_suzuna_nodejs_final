import express from "express";
import mongoose from "mongoose";
import env from "./config/env";
import cookieParser from "cookie-parser";
import authRouter from "./routes/auth/auth.routes";
import http from "http";
import { Server } from "socket.io";
import { registerGameSocketHandlers } from "./sockets/game.socket";
import roomRouter from "./routes/room/room.routes";

const app = express();
const allowedOrigins = new Set([
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "http://localhost:4173",
  "http://127.0.0.1:4173",
]);

app.use((req, res, next) => {
  const origin = req.headers.origin;

  if (origin && allowedOrigins.has(origin)) {
    res.header("Access-Control-Allow-Origin", origin);
    res.header("Access-Control-Allow-Credentials", "true");
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
    res.header(
      "Access-Control-Allow-Methods",
      "GET,POST,PUT,PATCH,DELETE,OPTIONS",
    );
  }

  if (req.method === "OPTIONS") {
    return res.sendStatus(204);
  }

  next();
});

app.use(express.json());
app.use(cookieParser());
app.use("/auth", authRouter);
app.use("/room", roomRouter);

const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: Array.from(allowedOrigins), credentials: true },
});
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
