import { container, injectable } from "tsyringe";
import { Event } from "../../../domain/entities/event";
import { Message } from "../../../domain/services/messaging/message";
import { MessageHandler } from "../../../domain/services/messaging/message-handler";
import { SaveEventToDatabaseUseCase } from "../../../domain/use-cases/save-event-to-database/save-event-to-database-use-case";
import { DiceRoller } from "../../../utils/dicer-roller";

@injectable()
export class EventTopicHandler implements MessageHandler {
    public constructor(private useCase: SaveEventToDatabaseUseCase) { }

    public async handle(message: Message<Event>): Promise<void> {
        const diceRoller: DiceRoller = container.resolve('DiceRoller');
        if (diceRoller.roll(5)) {
            // throw new Error('Algum erro intermitente');
        }

        await this.useCase.execute(message.body);
    }
}
