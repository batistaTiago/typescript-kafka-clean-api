import { MongoClient } from 'mongodb';
import { injectable } from 'tsyringe';

@injectable()
export class MongoConnection {
    protected readonly client: MongoClient;
    
    public constructor(client: MongoClient) {
        this.client = client;
    }

    public async connect() {
        await this.client.connect();
    }
}