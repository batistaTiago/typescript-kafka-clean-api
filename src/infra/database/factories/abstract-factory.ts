import { inject, autoInjectable } from "tsyringe";
import { WithId } from "../../../domain/dto/with-id";
import { Repository } from "../../../domain/services/repositories/repository";

@autoInjectable()
export class AbstractFactory<T> {
    public constructor(
        protected defaults: T,
        private readonly repo: Repository<T>,
    ) { }


    public async create(record: Partial<T> = this.defaults): Promise<T & WithId> {
        return await this.repo.insertOne(this.make(record));
    }

    public async createMany(records: Array<T>): Promise<Array<T & WithId>> {
        return await Promise.all(records.map(async record => await this.repo.insertOne(this.make(record))));
    }

    public make(record: Partial<T>): T {
        return Object.assign({}, this.defaults, record);
    }
}
