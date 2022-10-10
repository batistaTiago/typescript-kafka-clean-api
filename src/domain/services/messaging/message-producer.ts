import { Event as EventEntity } from "../../entities/event";

export interface MessageProducer {
    publish (topicName: string, data: EventEntity): Promise<void>
}