import { EventRepository } from "../../services/repositories/event-repository";
import { SaveEventToDatabaseUseCase } from "./save-event-to-database-use-case";

describe('SaveEventToDatabaseUseCase', () => {
    it('Should call producer with the same input received', async () => {
        const fakeRepository: EventRepository = {
            storeEvent: jest.fn()
        };

        const sut = new SaveEventToDatabaseUseCase(fakeRepository);
        // const saveSpy = jest.spyOn(fakeRepository, 'storeEvent').mockImplementation(jest.fn());
        const saveSpy = jest.spyOn(fakeRepository, 'storeEvent');

        const sampleData = { key: 'value' } as any;
        await sut.execute(sampleData);

        expect(saveSpy).toHaveBeenCalledTimes(1);
        expect(saveSpy).toHaveBeenCalledWith(sampleData);
    });

    it('Should let exception go through if producer throws', async () => {
        const fakeRepository: EventRepository = {
            storeEvent: jest.fn()
        };

        jest.spyOn(fakeRepository, 'storeEvent').mockImplementation(() => {
            throw new Error();
        });

        const sut = new SaveEventToDatabaseUseCase(fakeRepository);

        const sampleData = { key: 'value' } as any;
        const executionPromise = sut.execute(sampleData);

        expect(executionPromise).rejects.toThrow();
    });
});