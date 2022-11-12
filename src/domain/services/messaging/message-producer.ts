import { Message } from "./message";

export interface MessageProducer {
    publish (topicName: string, data: Message<object>): Promise<void>
}
