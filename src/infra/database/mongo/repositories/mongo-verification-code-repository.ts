import { injectable } from "tsyringe";
import { User } from "../../../../domain/entities/user";
import { VerificationCode } from "../../../../domain/entities/verification-code";
import { AppError } from "../../../../domain/exceptions/app-error";
import { VerificationCodeRepository } from "../../../../domain/services/repositories/verification-code-repository ";
import { VerificationCodeModel } from "../../../models/verification-code-model";
import { MongoBaseRepository } from "../mongo-base-repository";

@injectable()
export class MongoVerificationCodeRepository extends MongoBaseRepository implements VerificationCodeRepository {
    public collectionName(): string {
        return 'verification_codes';
    }

    public async storeValidationCode(data: VerificationCode): Promise<VerificationCodeModel> {
        const result = await this.insertOne(data);
        return this.canonizeId(Object.assign({}, data, { id: String(result.insertedId) }));
    }

    public async findByUser(user: User): Promise<VerificationCode> {
        const findResult = await this.findOne<VerificationCode>({ "user.email": user.email });
        if (!findResult) {
            throw new AppError('Code not found');
        }

        return this.canonizeId(findResult);
    }
}