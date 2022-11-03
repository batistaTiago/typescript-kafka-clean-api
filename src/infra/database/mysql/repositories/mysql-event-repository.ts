import { injectable } from "tsyringe";
import { BaseEntity, EntityTarget } from "typeorm";
import { Event as DomainEvent } from "../../../../domain/entities/event";
import { EventRepository } from "../../../../domain/services/repositories/event-repository";
import { EventModel } from "../../../../domain/dto/event-model";
import { Event as EventTypeORMModel } from "../entities/event.entity";
import { MysqlBaseRepository } from "../mysql-base-repository";

@injectable()
export class MysqlEventRepository extends MysqlBaseRepository implements EventRepository {
    public async storeEvent(data: DomainEvent): Promise<EventModel> {
        if (!this.connection.isInitialized) {
            await this.connection.initialize();
        }
        
        const result = await this.getTypeOrmRepo().save(data) as EventModel;
        return Object.assign({}, data, { id: String(result.id) });
    }

    protected entity(): EntityTarget<BaseEntity> {
        return EventTypeORMModel
    }
}