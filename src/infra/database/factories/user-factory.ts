import { inject, autoInjectable } from "tsyringe";
import { UserModel } from "../../../domain/dto/user/user-model";
import { UserRepository } from '../../../domain/services/repositories/user-repository'

@autoInjectable()
export class UserFactory {
    public static readonly defaults: Omit<UserModel, 'id'> = {
        password: "userpassword",
        name: "username",
        email: "email@test.dev",
        registrationDate: new Date('2022-11-10')
    }

    public constructor(
        @inject('UserRepository') private readonly repo?: UserRepository
    ) { }

    public async create(user: Partial<Omit<UserModel, 'id'>> = UserFactory.defaults): Promise<UserModel> {
        return await this.repo.storeUser(this.make(user));
    }

    public async createMany(users: Array<Omit<UserModel, 'id'>>): Promise<Array<UserModel>> {
        return await Promise.all(users.map(async user => await this.repo.storeUser(this.make(user))));
    }

    public make(user: Partial<Omit<UserModel, 'id'>>): Omit<UserModel, 'id'> {
        return Object.assign({}, UserFactory.defaults, user);
    }
}
