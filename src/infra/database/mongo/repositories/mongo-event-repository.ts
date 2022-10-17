import { injectable } from "tsyringe";
import { Event as EventEntity } from "../../../../domain/entities/event";
import { EventRepository } from "../../../../domain/services/repositories/event-repository";
import { EventModel } from "../../../models/event-model";
import { MongoBaseRepository } from "../mongo-base-repository";

@injectable()
export class MongoEventRepository extends MongoBaseRepository implements EventRepository {
    protected collectionName(): string {
        return 'app_events';
    }

    public async storeEvent(data: EventEntity): Promise<EventModel> {
        const result = await this.collection().insertOne(data);
        return this.canonizeId(Object.assign({}, data, { id: String(result.insertedId) }));
    }
}