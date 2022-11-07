import { inject, autoInjectable } from "tsyringe";
import { UserAccount } from "../../../domain/dto/user/user-account";
import { UserRepository } from '../../../domain/services/repositories/user-repository'

@autoInjectable()
export class UserFactory {
    public constructor(
        @inject('UserRepository') private readonly repo?: UserRepository
    ) { }

    public async create(user: Omit<UserAccount, 'id'>): Promise<UserAccount> {
        return await this.repo.storeUser(user);
    }

    public async createMany(users: Array<Omit<UserAccount, 'id'>>): Promise<Array<UserAccount>> {
        return await Promise.all(users.map(async user => await this.repo.storeUser(user)));
    }
}
