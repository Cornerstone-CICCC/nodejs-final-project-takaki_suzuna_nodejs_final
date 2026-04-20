// In this file, validates config setting etc
import dotenv from "dotenv";
dotenv.config();

const mongo_connection = process.env.MONGODB_CONNECTION;
const port = process.env.BACKEND_PORT;
const validated_secret = process.env.JWT_SECRET_KEY;
const salt = process.env.SALT_NUM;
if (!mongo_connection || !port || !validated_secret || !salt) {
  throw new Error("One of the essensial config is missing");
}

const env = {
  DATABASE_URL: mongo_connection,
  PORT: Number(port),
  JWT_SECRET_KEY: validated_secret,
  SALT: Number(salt),
};

export default env;
