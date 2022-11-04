import { UserModel } from "./user-model";
import { User } from "../../entities/user";

export interface SignUpDTO extends User {
    password: string;
    password_confirmation: string;
}

export interface SignUpDTOModel extends SignUpDTO, UserModel { }
