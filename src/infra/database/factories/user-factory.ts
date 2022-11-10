import { inject, autoInjectable } from "tsyringe";
import { UserAccount } from "../../../domain/dto/user/user-account";
import { UserRepository } from '../../../domain/services/repositories/user-repository'

@autoInjectable()
export class UserFactory {
    public static readonly defaults: Omit<UserAccount, 'id'> = {
        password: "userpassword",
        name: "username",
        email: "email@test.dev",
        registrationDate: new Date('2022-11-10')
    }

    public constructor(
        @inject('UserRepository') private readonly repo?: UserRepository
    ) { }

    public async create(user: Partial<Omit<UserAccount, 'id'>> = UserFactory.defaults): Promise<UserAccount> {
        return await this.repo.storeUser(this.make(user));
    }

    public async createMany(users: Array<Omit<UserAccount, 'id'>>): Promise<Array<UserAccount>> {
        return await Promise.all(users.map(async user => await this.repo.storeUser(this.make(user))));
    }

    public make(user: Partial<Omit<UserAccount, 'id'>>): Omit<UserAccount, 'id'> {
        return Object.assign({}, UserFactory.defaults, user);
    }
}
