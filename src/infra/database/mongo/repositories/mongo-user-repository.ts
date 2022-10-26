import { SignUpDTO, SignUpDTOModel } from "../../../../domain/dto/sign-up";
import { UserRepository } from "../../../../domain/services/repositories/user-repository";
import { UserModel } from "../../../models/user-model";
import { MongoBaseRepository } from "../mongo-base-repository";
import { ObjectId } from 'mongodb';
import { injectable } from "tsyringe";
import { AppError } from "../../../../domain/exceptions/app-error";

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

        return this.canonizeId(findResult);
    }
}
