import { inject, injectable } from "tsyringe";
import { EventModel } from "../../dto/event-model";
import { Event as EventEntitiy } from "../../entities/event";
import { EventRepository } from "../../services/repositories/event-repository";
import { UseCase } from "../use-case";

@injectable()
export class SaveEventToDatabaseUseCase implements UseCase {
    public constructor(@inject("EventRepository") private repository: EventRepository) { }

    // @@TODO: trocar por EventDTO?
    public async execute(data: EventEntitiy): Promise<EventModel> {
        return await this.repository.storeEvent(data);
    }
}
