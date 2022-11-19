import { MongoBaseRepository } from "../mongo-base-repository";
import { injectable } from "tsyringe";
import { PasswordRecoveryRepository } from "../../../../domain/services/repositories/password-recovery-repository";
import { PasswordRecoveryModel } from "../../../../domain/dto/user/password-recovery-model";
import { PasswordRecovery } from "../../../../domain/entities/password-recovery";
import { AppError } from "../../../../domain/exceptions/app-error";
import { ObjectId } from "mongodb";

@injectable()
export class MongoPasswordRecoveryRepository extends MongoBaseRepository implements PasswordRecoveryRepository {
    public collectionName(): string {
        return 'password-recoveries';
    }

    public async storeRecovery(recovery: PasswordRecovery): Promise<PasswordRecoveryModel> {
        const data = Object.assign({}, recovery, { expiresAt: recovery.expiresAt.toISOString() });
        const insertResult = await this.insertOne(data);

        return this.canonizeId(Object.assign({}, data, { id: String(insertResult.insertedId) }));
    }

    public async findRecovery(code: string, email: string): Promise<PasswordRecoveryModel> {
        const findResult = await this.findOne({ code: code, "user.email": email, used: false }, { sort: { _id: -1 } }) as PasswordRecoveryModel;

        if (!findResult) {
            throw new AppError('Invalid email or code');
        }

        return this.canonizeId(Object.assign({}, findResult, { expiresAt: new Date(findResult.expiresAt) }));
    }

    public async markAsUsed(id: string): Promise<void> {
        await this.updateOne({ _id: new ObjectId(id) }, { $set: { used: true } });
    }
}
