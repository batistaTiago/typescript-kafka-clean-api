import { MongoClient } from 'mongodb';
import { inject } from 'tsyringe';

export abstract class MongoBaseRepository {
    public constructor(@inject("MongoClient") public readonly client: MongoClient) { }

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
        return this.client.db().collection(this.collectionName());
    }

    protected insertOne(data: object) {
        // @@TODO: inserir com uuid
        return this.collection().insertOne(data);
    }

    protected async findOne<T>(filters: object): Promise<T> {
        return await this.collection().findOne(filters) as T;
    }
}
