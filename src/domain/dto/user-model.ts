import { User } from "../entities/user";

export interface UserModel extends User {
    id: string;
}