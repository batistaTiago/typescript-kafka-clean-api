import { inject, injectable } from "tsyringe";
import { Event } from "../../../domain/entities/event";
import { Events } from "../../../domain/enums/events";
import { Message } from "../../../domain/services/messaging/message";
import { MessageHandler } from "../../../domain/services/messaging/message-handler";
import { MessageProducer } from "../../../domain/services/messaging/message-producer";
import { SaveEventToDatabaseUseCase } from "../../../domain/use-cases/save-event-to-database/save-event-to-database-use-case";
import { DiceRoller } from "../../../utils/dicer-roller";

@injectable()
export class EventTopicHandler implements MessageHandler {
    public constructor(
        private saveEventToDatabaseUseCase: SaveEventToDatabaseUseCase,
        @inject('MessageProducer') private readonly producer: MessageProducer
    ) { }

    public async handle(message: Message<Event>): Promise<void> {
        // @@TODO: refatorar esse codigo para Promise.all() e um ou mais outro(s) UseCase(s)...
        await this.saveEventToDatabaseUseCase.execute(message.body);
        if (message.body.eventName === Events.USER_ACCOUNT_CREATED) {
            await this.producer.publish('users.created', { body: message.body.data });
        };
    }
}
