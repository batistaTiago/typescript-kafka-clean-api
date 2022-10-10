import { injectable } from "tsyringe";
import { MongoEventRepository } from "../../infra/database/mongo/repositories/mongo-event-repository";

@injectable()
export class SaveEventToMongoUseCase {
    public constructor(private repository: MongoEventRepository) {}

    public async execute(data: object) {
        await this.repository.storeEvent(data);
    }
}