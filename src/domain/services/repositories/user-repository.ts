import { UserModel } from "../../dto/user/user-model";
import { SignUpDTO, SignUpDTOModel } from "../../dto/user/sign-up";
import { UserAccount } from "../../dto/user/user-account";
import { UserUpdateableFields } from "../../dto/user/update-account";

export interface StoreUserRepository {
    storeUser(user: SignUpDTO): Promise<SignUpDTOModel>;
}

export interface FindByIdUserRepository {
    findById(id: string): Promise<UserModel>;
}

export interface FindByEmailUserRepository {
    findByEmail(email: string): Promise<UserModel>;
}

export interface AccountRepository {
    findAccountByEmail(email: string): Promise<UserAccount>;
    findAccountById(id: string): Promise<UserAccount>;
    updateAccount(account: UserAccount, fields: UserUpdateableFields): Promise<UserAccount>;
}


export declare type UserRepository = StoreUserRepository & FindByIdUserRepository & FindByEmailUserRepository & AccountRepository;
