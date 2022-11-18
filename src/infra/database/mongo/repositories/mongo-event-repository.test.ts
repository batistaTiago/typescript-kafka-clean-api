import { MongoEventRepository } from "./mongo-event-repository"
import { Db, MongoClient } from 'mongodb';
import { Event as EventEntity } from "../../../../domain/entities/event";
import { container } from "tsyringe";

describe('MongoEventRepository', () => {
    const client = container.resolve(MongoClient);
    const db: Db = client.db(container.resolve('MongoDatabaseName'));
    const sut = new MongoEventRepository();

    beforeAll(async () => {
        await client.connect();
    });

    afterAll(async () => {
        await client.close();
    });

    beforeEach(async () => {
        await db.dropDatabase();
    });

    it('should save a record in the database', async () => {
        const event: EventEntity = {
            eventName: 'SOME_EVENT_NAME',
            happenedAt: new Date(),
        };

        const result = await sut.storeEvent(event);

        expect((result as any)._id).not.toBeDefined();
        expect(result.id).toBeDefined();
        expect(result.eventName).toBeDefined();
        expect(result.happenedAt).toBeDefined();
    });

    it('should throw if mongodb connection throws', async () => {
        jest.spyOn(db, 'collection').mockImplementationOnce(() => {
            throw new Error();
        });

        const event: EventEntity = {
            eventName: 'SOME_EVENT_NAME',
            happenedAt: new Date(),
        };

        const result = sut.storeEvent(event);

        expect(result).rejects.toThrow();
    });
});
