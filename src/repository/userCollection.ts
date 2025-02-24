import getMultipleData from '../commons/utils/getMultipleData'
import { User } from '../entities/user'
import {users, ID,} from "../config/appwrite";

export const createUserCollection = async (user: Partial<User>): Promise<void> => {
  await users.create(ID.unique(),user.email, undefined, user.password, user.name)
}

