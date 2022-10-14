import { container } from "tsyringe";
import { constructor } from "tsyringe/dist/typings/types";
import { MessageHandler } from "../domain/services/messaging/message-handler";
import { KafkaTopicConsumer } from "../infra/messaging/kafka/consumer/kafka-topic-consumer";
import { Application } from "./application";
import topicHandlers from "./topic-handlers";

export class WorkerApplication extends Application {
    private handlerMappings: Map<String, constructor<MessageHandler>>;

    public constructor(private readonly topic: string) {
        super();

        this.handlerMappings = new Map<String, constructor<MessageHandler>>();
        for (let topic in topicHandlers) {
            this.handlerMappings.set(topic, topicHandlers[topic]);
        }
    }

    public async start(): Promise<void> {
        if (!this.handlerMappings.has(this.topic)) {
            throw new Error('Tópico não mapeado');
        }

        const handlerConstructor = this.handlerMappings.get(this.topic);

        // if (!container.isRegistered(handlerConstructor)) {
        //     throw new Error('Handler não registrado');
        // }

        const handler: MessageHandler = container.resolve(this.handlerMappings.get(this.topic));
        return await container.resolve(KafkaTopicConsumer).consume(this.topic, handler);
    }
}
