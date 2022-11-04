import { User } from "../../entities/user";
import { WithId } from "../with-id";

export interface UserModel extends User, WithId { }