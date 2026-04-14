import express from "express";
import mongoose from "mongoose";
import env from "./config/env";

const app = express();

app.use(express.json());

const PORT = env.PORT;
const MONGO_DB = env.DATABASE_URL;

if (!MONGO_DB) {
  throw new Error("Missing connection string");
}

mongoose
  .connect(MONGO_DB, { dbName: "dots_and_box" })
  .then(() => {
    console.log("\r\nMongoDB connected");
    app.listen(PORT, () => {
      console.log(`Server is listening on port ${PORT}\r\n`);
    });
  })
  .catch((e) => {
    console.log(e);
    throw new Error(e);
  });
