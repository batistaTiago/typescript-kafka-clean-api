import { inject, injectable } from "tsyringe";
import { Event } from "../../../domain/entities/event";
import { Events } from "../../../domain/enums/events";
import { Message } from "../../../domain/services/messaging/message";
import { MessageHandler } from "../../../domain/services/messaging/message-handler";
import { MessageProducer } from "../../../domain/services/messaging/message-producer";
import { SaveEventToDatabaseUseCase } from "../../../domain/use-cases/save-event-to-database/save-event-to-database-use-case";
import { UseCase } from "../../../domain/use-cases/use-case";

@injectable()
export class EventTopicHandler implements MessageHandler {
    public constructor(
        @inject(SaveEventToDatabaseUseCase) private saveEventToDatabaseUseCase: UseCase,
        @inject('MessageProducer') private readonly producer: MessageProducer
    ) { }

    public async handle({ body }: Message<Event>): Promise<void> {
        // @@TODO: refatorar esse codigo para Promise.all() e um ou mais outro(s) UseCase(s)...
        const topic = this.getForwardingTopic(body.eventName);
        await this.saveEventToDatabaseUseCase.execute(body);

        if (topic) {
            console.log(`Forwarding to ${topic}`);
            await this.producer.publish(topic, { body: body.data });
        }
    }

    private getForwardingTopic(eventName: string): string {
        switch (eventName) {
            case Events.USER_ACCOUNT_CREATED:
                return 'users.created';
            case Events.USER_ACCOUNT_UPDATED:
                return 'users.updated';
        }
    }
}
