import { IUser, User } from "../../models/auth/user.model";

async function insertUser(data: Partial<IUser>) {
  return await User.create(data);
}

async function findUser(id: string) {
  return await User.findById(id);
}

export default { insertUser, findUser };
