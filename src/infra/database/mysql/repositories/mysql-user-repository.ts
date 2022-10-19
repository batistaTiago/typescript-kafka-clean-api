
import { inject, injectable } from "tsyringe";
import { DataSource } from "typeorm";
import { SignUpDTO, SignUpDTOModel } from "../../../../domain/dto/sign-up";
import { User as DomainUser} from "../../../../domain/entities/user";
import { UserRepository } from "../../../../domain/services/repositories/user-repository";
import { UserModel} from "../../../models/user-model";
import { User as UserTypeORMModel } from "../entities/user.entity";

@injectable()
export class MysqlUserRepository implements UserRepository {
    public constructor(@inject('MysqlConnection') private readonly connection: DataSource) { }

    public async storeUser(data: SignUpDTO): Promise<SignUpDTOModel> {
        if (!this.connection.isInitialized) {
            await this.connection.initialize();
        }

        return await this.connection.getRepository(UserTypeORMModel).save(data);
    }

    public async findById(id: number): Promise<UserModel> {
        if (!this.connection.isInitialized) {
            await this.connection.initialize();
        }
        
        throw new Error("Method not implemented.");
    }
}