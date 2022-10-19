import { DataSource } from "typeorm";
import { MysqlEventRepository } from "./mysql-event-repository";

const mockedDate = new Date('2022-10-10');
jest.spyOn<any, any>(global, 'Date').mockImplementation(() => {
    return mockedDate;
});

const sampleData = {
    eventName: "TEST EVENT",
    happenedAt: mockedDate
};

describe('MysqlEventRepository', () => {
    it('it should forward call to typeorm', async () => {
        const fakeDataSourceRepository = {
            save: jest.fn().mockReturnValueOnce({
                id: 1,
                ...sampleData
            })
        };

        const dataSource = ({
            isInitialized: true,
            getRepository: jest.fn().mockReturnValue(fakeDataSourceRepository)
        } as unknown) as DataSource;

        const saveSpy = jest.spyOn(fakeDataSourceRepository, 'save');

        const sut = new MysqlEventRepository(dataSource);

        const result = await sut.storeEvent(sampleData);

        expect(saveSpy).toHaveBeenCalledWith(sampleData);
        expect(result.id).toBe('1');
        expect(result.eventName).toBe('TEST EVENT');
        expect(result.happenedAt).toBe(mockedDate);
    });
});