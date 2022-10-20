import { SignUpDTO, SignUpDTOModel } from "../../../../domain/dto/sign-up";
import { UserRepository } from "../../../../domain/services/repositories/user-repository";
import { UserModel } from "../../../models/user-model";
import { MongoBaseRepository } from "../mongo-base-repository";
import { ObjectId } from 'mongodb';
import { injectable } from "tsyringe";

@injectable()
export class MongoUserRepository extends MongoBaseRepository implements UserRepository {
    protected collectionName(): string {
        return 'users';
    }

    public async storeUser(user: SignUpDTO): Promise<SignUpDTOModel> {
        const result = await this.insertOne(user);
        return this.canonizeId(Object.assign({}, user, { id: String(result.insertedId) }));
    }

    public async findById(id: string): Promise<UserModel> {
        const findResult = await this.findOne({ _id: new ObjectId(id) });
        if (!findResult) {
            throw new Error('nao achei!');
        }

        const { _id, ...user } = Object.assign({}, findResult, { id: String(findResult._id) });
        return user as any;
    }
}
