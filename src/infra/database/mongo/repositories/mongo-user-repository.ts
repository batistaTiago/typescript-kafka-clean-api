import { SignUpDTO } from "../../../../domain/dto/user/sign-up";
import { UserRepository } from "../../../../domain/services/repositories/user-repository";
import { UserModel } from "../../../../domain/dto/user/user-model";
import { MongoBaseRepository } from "../mongo-base-repository";
import { ObjectId } from 'mongodb';
import { injectable } from "tsyringe";
import { AppError } from "../../../../domain/exceptions/app-error";
import { UserUpdateableFields } from "../../../../domain/dto/user/update-account";
import { MongoGenericRepository } from "../mongo-generic-repository";
import { User } from "../../../../domain/entities/user";

@injectable()
export class MongoUserRepository extends MongoGenericRepository<User> implements UserRepository {
    public constructor() {
        super('users');
    }

    public async storeUser(user: User): Promise<UserModel> {
        const record = await this.findOne({ email: user.email });

        if (record) {
            throw new AppError('This email address is already taken by another user');
        }

        return await this.insertOne(user);
    }

    public async findById(id: string): Promise<UserModel> {
        const findResult = await this.findOne<object>({ _id: new ObjectId(id) });
        if (!findResult) {
            throw new AppError('User not found...');
        }

        return this.canonizeId(findResult);
    }

    public async findByEmail(email: string): Promise<UserModel> {
        const findResult = await this.findOne({ email });
        if (!findResult) {
            throw new AppError('User not found...');
        }

        return this.canonizeId(findResult);
    }

    public async findAccountByEmail(email: string): Promise<UserModel> {
        const findResult = await this.findOne<object>({ email });
        if (!findResult) {
            throw new AppError('User not found...');
        }

        return this.canonizeId(findResult);
    }

    public async findAccountById(id: string): Promise<UserModel> {
        const findResult = await this.findOne<object>({ _id: new ObjectId(id) });
        if (!findResult) {
            throw new AppError('User not found...');
        }

        return this.canonizeId(findResult);
    }

    public async updateAccount(account: UserModel, fields: UserUpdateableFields): Promise<UserModel> {
        const updatedAccount = Object.assign({}, account, { ...fields });
        
        await this.updateOne({ _id: new ObjectId(account.id) }, { $set: { ...fields } });
        
        return updatedAccount;
    }
}
