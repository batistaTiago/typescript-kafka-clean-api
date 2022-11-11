import { injectable } from "tsyringe";
import { AccessTokenModel } from "../../../../domain/dto/user/access-token-model";
import { AccessToken } from "../../../../domain/entities/access-token";
import { AppError } from "../../../../domain/exceptions/app-error";
import { AccessTokenRepository } from "../../../../domain/services/repositories/access-token-repository";
import { MongoBaseRepository } from "../mongo-base-repository";

@injectable()
export class MongoAccessTokenRepository extends MongoBaseRepository implements AccessTokenRepository {
    public collectionName(): string {
        return 'access_tokens';
    }

    public async findToken(token: string): Promise<AccessTokenModel> {
        const findResult = await this.findOne({ token });
        if (!findResult) {
            throw new AppError('Token not found');
        }

        return this.canonizeId(findResult);
    }

    public async storeToken(data: Partial<AccessToken>): Promise<AccessTokenModel> {
        const insertResult = await this.insertOne({ ...data });
        return this.canonizeId(Object.assign({}, data, { id: String(insertResult.insertedId) }));
    }

    public async revokeToken(token: string): Promise<boolean> {
        throw new Error("Method not implemented.");
    }
}
