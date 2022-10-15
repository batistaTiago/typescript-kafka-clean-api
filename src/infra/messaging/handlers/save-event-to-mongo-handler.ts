import { injectable } from "tsyringe";
import { Event } from "../../../domain/entities/event";
import { MessageHandler } from "../../../domain/services/messaging/message-handler";
import { SaveEventToDatabaseUseCase } from "../../../domain/use-cases/save-event-to-mongo/save-event-to-database-use-case";

@injectable()
export class EventTopicHandler implements MessageHandler {
    public constructor(private useCase: SaveEventToDatabaseUseCase) {}

    public async handle(message: Event): Promise<void> {
        await this.useCase.execute(message);
    }
}
