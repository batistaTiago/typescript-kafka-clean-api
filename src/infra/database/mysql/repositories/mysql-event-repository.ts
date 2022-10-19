import { inject, injectable } from "tsyringe";
import { DataSource } from "typeorm";
import { Event as DomainEvent } from "../../../../domain/entities/event";
import { EventRepository } from "../../../../domain/services/repositories/event-repository";
import { EventModel } from "../../../models/event-model";
import { Event as EventTypeORMModel } from "../entities/event.entity";

@injectable()
export class MysqlEventRepository implements EventRepository {
    public constructor(@inject('MysqlConnection') private readonly connection: DataSource) { }

    public async storeEvent(data: DomainEvent): Promise<EventModel> {
        if (!this.connection.isInitialized) {
            await this.connection.initialize();
        }

        const result = await this.connection.getRepository(EventTypeORMModel).save(data);
        return Object.assign({}, result, { id: String(result.id) });
    }
}