import { Collection, Db } from 'mongodb';
import { autoInjectable, inject } from "tsyringe";
import { Repository } from "../../../domain/services/repositories/repository";
import { WithId } from "../../../domain/dto/with-id";

@autoInjectable()
export class MongoGenericRepository<T> implements Repository<T> {
    public constructor(
        public readonly collectionName: string,
        @inject('MongoDatabaseConnection') private readonly connection?: Db
    ) { }
    
    private get collection(): Collection {
        return this.connection.collection(this.collectionName);
    }

    protected canonizeId(data: any): any {
        const preProcessedOutput = Object.assign({}, data, { id: String(data._id) });
        const { _id, ...output } = preProcessedOutput;

        return output;
    }

    public async insertOne(data: T): Promise<T & WithId> {
        const { insertedId } = await this.collection.insertOne(data);
        return this.canonizeId(Object.assign({}, data, { id: String(insertedId) }));
    }

    public async findOne<T>(filters: Partial<T>, options?: object): Promise<T> {
        return await this.collection.findOne(filters, options) as T;
    }

    public async updateOne<T>(filters: Partial<T>, fields: object): Promise<T> {
        return await this.collection.updateOne(filters, fields) as T;
    }
}
