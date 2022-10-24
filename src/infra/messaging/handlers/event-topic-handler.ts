import { container, injectable } from "tsyringe";
import { Event } from "../../../domain/entities/event";
import { Message } from "../../../domain/services/messaging/message";
import { MessageHandler } from "../../../domain/services/messaging/message-handler";
import { MessageProducer } from "../../../domain/services/messaging/message-producer";
import { SaveEventToDatabaseUseCase } from "../../../domain/use-cases/save-event-to-database/save-event-to-database-use-case";
import { DiceRoller } from "../../../utils/dicer-roller";

@injectable()
export class EventTopicHandler implements MessageHandler {
    public constructor(private saveEventToDatabaseUseCase: SaveEventToDatabaseUseCase) { }

    public async handle(message: Message<Event>): Promise<void> {
        const diceRoller: DiceRoller = container.resolve('DiceRoller');
        const producer = container.resolve<MessageProducer>('MessageProducer');

        if (diceRoller.roll(5)) {
            // throw new Error('Algum erro intermitente');
        }

        // @@TODO: refatorar esse codigo para Promise.all() e um ou mais outro(s) UseCase(s)...
        await this.saveEventToDatabaseUseCase.execute(message.body);
        if (message.body.eventName === 'USER_ACCOUNT_CREATED') {
            await producer.publish('users.created', { body: message.body.data });
        };
    }
}
