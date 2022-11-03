import { EventModel } from "../../dto/event-model";
import { Event as EventEntity } from "../../entities/event";

export interface EventRepository {
    storeEvent(data: EventEntity): Promise<EventModel>;
}