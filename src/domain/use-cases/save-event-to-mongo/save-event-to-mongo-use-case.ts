import { injectable } from "tsyringe";
import { MongoEventRepository } from "../../../infra/database/mongo/repositories/mongo-event-repository";
import { Event as EventEntitiy } from "../../entities/event";

@injectable()
export class SaveEventToMongoUseCase {
    public constructor(private repository: MongoEventRepository) {}

    public async execute(data: EventEntitiy) {
        await this.repository.storeEvent(data);
    }
}