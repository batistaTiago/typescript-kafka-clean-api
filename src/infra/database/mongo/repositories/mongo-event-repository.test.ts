import { MongoEventRepository } from "./mongo-event-repository"
import { MongoClient } from 'mongodb';
import { Event as EventEntity } from "../../../../domain/entities/event";
import { Environment } from "../../../../config/environment";

describe('MongoEventRepository', () => {
    const client = new MongoClient(Environment.MONGO_CONNECTION_URI);
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
    });

    it('should throw if mongodb client throws', async () => {
        jest.spyOn(client, 'db').mockImplementationOnce(() => {
            throw new Error();
        });

        const event: EventEntity = {
            eventName: 'abc',
            happenedAt: new Date(),
        };

        const result = sut.storeEvent(event);

        expect(result).rejects.toThrow();
    });
});
