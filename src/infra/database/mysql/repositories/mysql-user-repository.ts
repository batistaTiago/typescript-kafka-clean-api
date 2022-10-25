
import { injectable } from "tsyringe";
import { EntityTarget } from "typeorm";
import { SignUpDTO, SignUpDTOModel } from "../../../../domain/dto/sign-up";
import { AppError } from "../../../../domain/exceptions/app-error";
import { UserRepository } from "../../../../domain/services/repositories/user-repository";
import { UserModel} from "../../../models/user-model";
import { User as UserTypeORMModel } from "../entities/user.entity";
import { MysqlBaseRepository } from "../mysql-base-repository";

@injectable()
export class MysqlUserRepository extends MysqlBaseRepository implements UserRepository {
    public async storeUser(data: SignUpDTO): Promise<SignUpDTOModel> {
        if (!this.connection.isInitialized) {
            await this.connection.initialize();
        }

        const user = await this.getTypeOrmRepo().findOne(this.generateWhereClause({ email: data.email }));
        if (user) {
            throw new AppError('This email address is already taken by another user');
        }

        return (await this.getTypeOrmRepo().save(data) as SignUpDTOModel);
    }

    public async findById(id: string): Promise<UserModel> {
        if (!this.connection.isInitialized) {
            await this.connection.initialize();
        }

        const result = await this.getTypeOrmRepo().findOne(this.generateWhereClause({ id })) as UserModel;

        if (!result) {
            throw new AppError('User not found');
        }

        return result;
    }

    public async findByEmail(email: string): Promise<UserModel> {
        if (!this.connection.isInitialized) {
            await this.connection.initialize();
        }

        const result = await this.getTypeOrmRepo().findOne(this.generateWhereClause({ email })) as UserModel;
        if (!result) {
            throw new AppError('User not found');
        }

        return result;
    }

    protected entity(): EntityTarget<object> {
        return UserTypeORMModel;
    }
}