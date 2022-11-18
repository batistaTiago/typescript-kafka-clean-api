import { MongoBaseRepository } from "../mongo-base-repository";
import { injectable } from "tsyringe";
import { PasswordRecoveryRepository } from "../../../../domain/services/repositories/password-recovery-repository";
import { PasswordRecoveryModel } from "../../../../domain/dto/user/password-recovery-model";

@injectable()
export class MongoPasswordRecoveryRepository extends MongoBaseRepository implements PasswordRecoveryRepository {
    public collectionName(): string {
        return 'password-recoveries';
    }

    public async storeRecovery(recovery: Omit<PasswordRecoveryModel, 'id'>): Promise<object> {
        const data = Object.assign({}, recovery, { expiresAt: recovery.expiresAt.toISOString() });
        const insertResult = await this.insertOne(data);

        return this.canonizeId(Object.assign({}, data, { id: String(insertResult.insertedId) }));
    }
}
