import { injectable } from "tsyringe";
import { Event } from "../../../domain/entities/event";
import { MessageHandler } from "../../../domain/services/messaging/message-handler";
import { SaveEventToMongoUseCase } from "../../../domain/use-cases/save-event-to-mongo/save-event-to-mongo-use-case";

@injectable()
export class EventTopicHandler implements MessageHandler {
    public constructor(private useCase: SaveEventToMongoUseCase) {}

    public async handle(message: Event): Promise<void> {
        await this.useCase.execute(message);
    }
}
