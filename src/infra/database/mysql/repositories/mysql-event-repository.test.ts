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
    it('it should add data to the mysql database', async () => {
        
    });
});