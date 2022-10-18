import { injectable } from "tsyringe";
import { Event } from "../../../domain/entities/event";
import { Message } from "../../../domain/services/messaging/message";
import { MessageHandler } from "../../../domain/services/messaging/message-handler";
import { SaveEventToDatabaseUseCase } from "../../../domain/use-cases/save-event-to-database/save-event-to-database-use-case";

@injectable()
export class EventTopicHandler implements MessageHandler {
    public constructor(private useCase: SaveEventToDatabaseUseCase) { }

    public async handle(message: Message<Event>): Promise<void> {
        if (Math.random() <= 0.75) {
            throw new Error('Algum erro intermitente');
        }

        await this.useCase.execute(message.body);
    }
}
