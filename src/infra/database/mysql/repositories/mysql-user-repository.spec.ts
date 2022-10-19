
import { DataSource } from "typeorm";
import { SignUpDTO } from "../../../../domain/dto/sign-up";
import { User } from "../../../../domain/entities/user";
import { MysqlUserRepository } from "./mysql-user-repository";

const mockedDate = new Date('2022-10-10');
jest.spyOn<any, any>(global, 'Date').mockImplementation(() => {
    return mockedDate;
});

const sampleData: SignUpDTO = {
    email: "test-email@test.dev",
    name: "test name",
    password: "test pass",
    password_confirmation: "test pass",
    registrationDate: new Date()
};

describe('MysqlUserRepository', () => {
    it('it should forward call to typeorm', async () => {
        const fakeDataSourceRepository = {
            save: jest.fn().mockReturnValueOnce({
                id: '1',
                ...sampleData,
            })
        };

        const dataSource = ({
            isInitialized: true,
            getRepository: jest.fn().mockReturnValue(fakeDataSourceRepository)
        } as unknown) as DataSource;

        const saveSpy = jest.spyOn(fakeDataSourceRepository, 'save');

        const sut = new MysqlUserRepository(dataSource);

        const result = await sut.storeUser(sampleData);

        expect(saveSpy).toHaveBeenCalledWith(sampleData);
        expect(result.id).toBe('1');
        expect(result.email).toBe('test-email@test.dev');
        expect(result.name).toBe('test name');
        expect(result.password).toBe('test pass');
        expect(result.registrationDate).toBe(new Date());
    });
});