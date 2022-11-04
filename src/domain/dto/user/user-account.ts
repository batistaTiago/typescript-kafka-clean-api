import { UserModel } from "./user-model";

export interface UserAccount extends UserModel {
    password: string;
}