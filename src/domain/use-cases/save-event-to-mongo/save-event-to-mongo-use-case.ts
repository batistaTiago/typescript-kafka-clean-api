import { inject, injectable } from "tsyringe";
import { EventModel } from "../../../infra/models/event-model";
import { Event as EventEntitiy } from "../../entities/event";
import { EventRepository } from "../../services/repositories/event-repository";

@injectable()
export class SaveEventToMongoUseCase {
    public constructor(@inject("MongoEventRepository") private repository: EventRepository) {}

    public async execute(data: EventEntitiy): Promise<EventModel> {
        return await this.repository.storeEvent(data);
    }
}