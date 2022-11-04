import { SignUpDTO, SignUpDTOModel } from "../../../../domain/dto/user/sign-up";
import { UserRepository } from "../../../../domain/services/repositories/user-repository";
import { UserModel } from "../../../../domain/dto/user/user-model";
import { MongoBaseRepository } from "../mongo-base-repository";
import { ObjectId } from 'mongodb';
import { injectable } from "tsyringe";
import { AppError } from "../../../../domain/exceptions/app-error";
import { UserAccount } from "../../../../domain/dto/user/user-account";
import { UserUpdateableFields } from "../../../../domain/dto/user/update-account";

@injectable()
export class MongoUserRepository extends MongoBaseRepository implements UserRepository {
    public collectionName(): string {
        return 'users';
    }

    public async storeUser(signUpDto: SignUpDTO): Promise<SignUpDTOModel> {
        const record = await this.findOne({ email: signUpDto.email });

        if (record) {
            throw new AppError('This email address is already taken by another user');
        }

        const { password_confirmation, ...user } = signUpDto;

        const result = await this.insertOne(user);
        return this.canonizeId(Object.assign({}, user, { id: String(result.insertedId) }));
    }

    public async findById(id: string): Promise<UserModel> {
        const findResult = await this.findOne<object>({ _id: new ObjectId(id) });
        if (!findResult) {
            throw new AppError('User not found...');
        }

        const { password, ...output } = this.canonizeId(findResult);
        return output;
    }

    public async findByEmail(email: string): Promise<UserModel> {
        const findResult = await this.findOne({ email });
        if (!findResult) {
            throw new AppError('User not found...');
        }

        const { password, ...output } = this.canonizeId(findResult);
        return output;
    }

    public async findAccountByEmail(email: string): Promise<UserAccount> {
        const findResult = await this.findOne<object>({ email });
        if (!findResult) {
            throw new AppError('User not found...');
        }

        return this.canonizeId(findResult);
    }

    public async findAccountById(id: string): Promise<UserAccount> {
        const findResult = await this.findOne<object>({ _id: new ObjectId(id) });
        if (!findResult) {
            throw new AppError('User not found...');
        }

        return this.canonizeId(findResult);
    }

    public async updateAccount(account: UserAccount, fields: UserUpdateableFields): Promise<UserAccount> {
        const updatedAccount = Object.assign({}, account, { ...fields });
        
        await this.updateOne({ _id: new ObjectId(account.id) }, { $set: { ...fields } });
        
        return updatedAccount;
    }
}
