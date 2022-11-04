import { Event } from "../entities/event";
import { WithId } from "./with-id";

export interface EventModel extends Event, WithId { }