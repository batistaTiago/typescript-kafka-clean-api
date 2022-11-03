import { container } from "tsyringe";
import { MessageHandler } from "../domain/services/messaging/message-handler";
import { KafkaTopicConsumer } from "../infra/messaging/kafka/consumer/kafka-topic-consumer";
import { GenericConstructor } from "../utils/generic-constructor-type";
import { Application } from "./application";
import topicHandlers from "./topic-handlers";

export class WorkerApplication extends Application {
    private handlerMappings: Map<String, GenericConstructor<MessageHandler>>;

    public constructor(private readonly topic: string) {
        super();

        this.handlerMappings = new Map<String, GenericConstructor<MessageHandler>>();
        for (const topic in topicHandlers) {
            this.handlerMappings.set(topic, topicHandlers[topic]);
        }
    }

    public async start(): Promise<void> {
        if (!this.handlerMappings.has(this.topic)) {
            throw new Error('Tópico não mapeado');
        }

        const handler: MessageHandler = container.resolve(this.handlerMappings.get(this.topic));
        return await container.resolve(KafkaTopicConsumer).consume(this.topic, handler);
    }
}
