import { SignUpDTO, SignUpDTOModel } from "../../../../domain/dto/sign-up";
import { UserRepository } from "../../../../domain/services/repositories/user-repository";
import { MongoBaseRepository } from "../mongo-base-repository";

export class MongoUserRepository extends MongoBaseRepository implements UserRepository {
    protected collectionName(): string {
        return 'users';
    }

    public async storeUser(user: SignUpDTO): Promise<SignUpDTOModel> {
        const result = await this.insertOne(user);
        return this.canonizeId(Object.assign({}, user, { id: String(result.insertedId) }));
    }
}