import { injectable } from "tsyringe";
import { Event as EventEntity } from "../../../../domain/entities/event";
import { EventRepository } from "../../../../domain/services/repositories/event-repository";
import { EventModel } from "../../../models/event-model";
import { MongoBaseRepository } from "../base-mongo-repository";

@injectable()
export class MongoEventRepository extends MongoBaseRepository implements EventRepository {
    // @@TODO: remover esse extends e receber por injecao de dep?
    private collectionName: string = 'app_events';

    public async storeEvent(data: EventEntity): Promise<EventModel> {
        const result = await this.client.db().collection(this.collectionName).insertOne(data);
        return this.canonizeId(Object.assign({}, data, { id: String(result.insertedId) }));
    }
}