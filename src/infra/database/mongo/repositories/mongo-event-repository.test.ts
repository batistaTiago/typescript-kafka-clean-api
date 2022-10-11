import { MongoEventRepository } from "./mongo-event-repository"
import { MongoClient } from 'mongodb';
import { Event as EventEntity } from "../../../../domain/entities/event";

describe('MongoEventRepository', () => {
    const client = new MongoClient(process.env.MONGO_URL);
    const sut = new MongoEventRepository(client);

    beforeAll(async () => {
        await sut.connect();
    });

    afterAll(async () => {
        await sut.disconnect();
    });

    it('should forward call to mongodb client', async () => {
        const event: EventEntity = {
            eventName: 'abc',
            happenedAt: new Date(),
        };

        const result = await sut.storeEvent(event);

        expect((result as any)._id).not.toBeDefined();
        expect(result.id).toBeDefined();
        expect(result.eventName).toBeDefined();
        expect(result.happenedAt).toBeDefined();
    })
})