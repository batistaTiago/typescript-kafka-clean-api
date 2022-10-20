
import { inject, injectable } from "tsyringe";
import { DataSource, FindOneOptions } from "typeorm";
import { SignUpDTO, SignUpDTOModel } from "../../../../domain/dto/sign-up";
import { UserRepository } from "../../../../domain/services/repositories/user-repository";
import { UserModel} from "../../../models/user-model";
import { User, User as UserTypeORMModel } from "../entities/user.entity";

@injectable()
export class MysqlUserRepository implements UserRepository {
    public constructor(@inject('MysqlConnection') private readonly connection: DataSource) { }

    public async storeUser(data: SignUpDTO): Promise<SignUpDTOModel> {
        if (!this.connection.isInitialized) {
            await this.connection.initialize();
        }

        const user = await this.getTypeOrmRepo().findOne(this.generateWhereClause({ email: data.email }));
        if (user) {
            throw new Error('This email address is already taken by another user');
        }

        return await this.getTypeOrmRepo().save(data);
    }

    public async findById(id: string): Promise<UserModel> {
        if (!this.connection.isInitialized) {
            await this.connection.initialize();
        }

        return await this.getTypeOrmRepo().findOne(this.generateWhereClause({ id }));
    }

    public async findByEmail(email: string): Promise<UserModel> {
        if (!this.connection.isInitialized) {
            await this.connection.initialize();
        }

        return await this.getTypeOrmRepo().findOne(this.generateWhereClause({ email }));
    }

    private generateWhereClause(fields: Partial<User>): FindOneOptions<User> {
        return {
            where: {
                ...fields
            }
        };
    }

    private getTypeOrmRepo() {
        return this.connection.getRepository(UserTypeORMModel)
    }
}