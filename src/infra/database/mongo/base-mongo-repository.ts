import { MongoClient } from 'mongodb';
import { injectable } from 'tsyringe';

@injectable()
export class MongoBaseRepository {
    public constructor(protected readonly client: MongoClient) { }

    public async connect(): Promise<void> {
        await this.client.connect();
    }

    public async disconnect(): Promise<void> {
        await this.client.close();
    }

    protected canonizeId(data: any): any {
        const preProcessedOutput = Object.assign({}, data, { id: data._id })
        const { _id, ...output } = preProcessedOutput;

        return output;
    }
}