
import { injectable } from "tsyringe";
import { EntityTarget } from "typeorm";
import { User } from "../../../../domain/entities/user";
import { VerificationCode } from "../../../../domain/entities/verification-code";
import { VerificationCodeRepository } from "../../../../domain/services/repositories/verification-code-repository ";
import { VerificationCodeModel } from "../../../models/verification-code-model";
import { VerificationCode as VerificationCodeTypeORMEntitiy } from "../entities/verification-code.entitiy";
import { MysqlBaseRepository } from "../mysql-base-repository";

@injectable()
export class MysqlVerificationCodeRepository extends MysqlBaseRepository implements VerificationCodeRepository {
    public async storeValidationCode(data: VerificationCode): Promise<VerificationCodeModel> {
        throw new Error("Method not implemented.");
    }

    public async findByUser(user: User): Promise<VerificationCode> {
        throw new Error("Method not implemented.");
    }

    protected entity(): EntityTarget<VerificationCode> {
        return VerificationCodeTypeORMEntitiy;
    }
}