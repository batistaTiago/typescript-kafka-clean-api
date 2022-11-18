import { EventModel } from "../../../../domain/dto/event-model";
import { Event } from "../../../../domain/entities/event";
import { EventRepository } from "../../../../domain/services/repositories/event-repository";
import { MongoGenericRepository } from "../mongo-generic-repository";

export class MongoEventRepository extends MongoGenericRepository<Event> implements EventRepository {
    public constructor() {
        super('events');
    }

    public async storeEvent(data: Event): Promise<EventModel> {
        return await this.insertOne(data);
    }
}