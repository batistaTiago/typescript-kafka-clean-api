import { injectable } from "tsyringe";
import { AccessTokenModel } from "../../../../domain/dto/user/access-token-model";
import { UserModel } from "../../../../domain/dto/user/user-model";
import { AccessToken } from "../../../../domain/entities/access-token";
import { AppError } from "../../../../domain/exceptions/app-error";
import { AccessTokenRepository } from "../../../../domain/services/repositories/access-token-repository";
import { MongoGenericRepository } from "../mongo-generic-repository";

@injectable()
export class MongoAccessTokenRepository extends MongoGenericRepository<AccessToken> implements AccessTokenRepository {
    public constructor() {
        super('access_tokens');
    }

    public async findToken(token: string): Promise<AccessTokenModel> {
        const findResult = await this.findOne({ token });
        if (!findResult) {
            throw new AppError(`Token not found: ${token}`);
        }

        return this.canonizeId(findResult);
    }

    public async storeToken(data: AccessToken): Promise<AccessTokenModel> {
        return await this.insertOne({ ...data });
    }

    public async revokeToken(token: string): Promise<boolean> {
        throw new Error("Method not implemented.");
    }

    public async revokeAllFromUser({ id }: UserModel): Promise<void> {
        await this.updateMany({ userId: id }, { isRevoked: true });
    }
}
