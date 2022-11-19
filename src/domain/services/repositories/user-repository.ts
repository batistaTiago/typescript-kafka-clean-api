import { UserModel } from "../../dto/user/user-model";
import { UserUpdateableFields } from "../../dto/user/update-account";
import { User } from "../../entities/user";

export interface StoreUserRepository {
    storeUser(user: User): Promise<UserModel>;
}

export interface FindByIdUserRepository {
    findById(id: string): Promise<UserModel>;
}

export interface FindByEmailUserRepository {
    findByEmail(email: string): Promise<UserModel>;
}

export interface AccountRepository {
    findAccountByEmail(email: string): Promise<UserModel>;
    findAccountById(id: string): Promise<UserModel>;
    updateAccount(account: UserModel, fields: UserUpdateableFields): Promise<UserModel>;
    updateAccountByEmail(email: string, fields: UserUpdateableFields): Promise<void>;
}


export declare type UserRepository = StoreUserRepository & FindByIdUserRepository & FindByEmailUserRepository & AccountRepository;
