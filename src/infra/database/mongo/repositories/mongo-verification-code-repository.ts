import { injectable } from "tsyringe";
import { VerificationCode } from "../../../../domain/entities/verification-code";
import { VerificationCodeRepository } from "../../../../domain/services/repositories/verification-code-repository ";
import { VerificationCodeModel } from "../../../models/verification-code-model";
import { MongoBaseRepository } from "../mongo-base-repository";

@injectable()
export class MongoVerificationCodeRepository extends MongoBaseRepository implements VerificationCodeRepository {
    protected collectionName(): string {
        return 'verification_codes';
    }

    public async storeValidationCode(data: VerificationCode): Promise<VerificationCodeModel> {
        const result = await this.insertOne(data);
        return this.canonizeId(Object.assign({}, data, { id: String(result.insertedId) }));
    }
}