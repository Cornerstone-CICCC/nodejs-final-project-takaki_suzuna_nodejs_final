import bcrypt from "bcrypt";
async function hashPassword(password: string, salt: number) {
  return await bcrypt.hash(password, salt);
}

export default hashPassword;
