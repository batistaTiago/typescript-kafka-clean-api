import { MongoClient } from 'mongodb';
import { container, inject } from 'tsyringe';
import { Environment } from '../../../config/environment';

export abstract class MongoBaseRepository {
    private readonly dbName: string;

    public constructor(
        @inject("MongoClient") public readonly client: MongoClient,
        @inject('MongoDatabaseName') dbName?: string
    ) { 
        this.dbName = dbName ?? Environment.MONGO_DATABASE_NAME;
    }

    public abstract collectionName(): string;

    public async connect(): Promise<void> {
        await this.client.connect();
    }

    public async disconnect(): Promise<void> {
        await this.client.close();
    }

    protected canonizeId(data: any): any {
        const preProcessedOutput = Object.assign({}, data, { id: String(data._id) });
        const { _id, ...output } = preProcessedOutput;

        return output;
    }

    private collection() {
        return this.client.db(this.dbName).collection(this.collectionName());
    }

    protected insertOne(data: object) {
        // @@TODO: inserir com uuid
        return this.collection().insertOne(data);
    }

    protected async findOne<T>(filters: object, options?: object): Promise<T> {
        return await this.collection().findOne(filters, options) as unknown as T;
    }

    protected async updateOne<T>(filters: object, fields: object): Promise<T> {
        return await this.collection().updateOne(filters, fields) as unknown as T;
    }
}
