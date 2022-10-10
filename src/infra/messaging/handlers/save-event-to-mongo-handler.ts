import { injectable } from "tsyringe";
import { MessageHandler } from "../../../domain/services/messaging/message-handler";
import { SaveEventToMongoUseCase } from "../../../domain/use-cases/save-event-to-mongo-use-case";

@injectable()
export class EventTopicHandler implements MessageHandler {
    public constructor(private useCase: SaveEventToMongoUseCase) {}

    public async handle(message: object): Promise<void> {
        console.log("message received...");
        await this.useCase.execute(message);
    }
}