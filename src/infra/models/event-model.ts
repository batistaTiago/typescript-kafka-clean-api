import { Event } from "../../domain/entities/event";

export interface EventModel extends Event {
    id: string;
}