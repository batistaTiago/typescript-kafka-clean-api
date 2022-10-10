import { injectable } from "tsyringe";
import { EventRepository } from "../../../../domain/services/repositories/event-repository";
import { MongoConnection } from "../mongo-connection";

@injectable()
export class MongoEventRepository extends MongoConnection implements EventRepository {
    // @@TODO: remover esse extends e receber por injecao de dep?
    private collectionName: string = 'app_events';

    public async storeEvent(data: object): Promise<any> {
        return await this.client.db().collection(this.collectionName).insertOne(data);
    }
}