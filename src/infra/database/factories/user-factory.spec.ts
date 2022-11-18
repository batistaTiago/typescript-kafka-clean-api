import { User } from '../../../domain/entities/user';
import { UserRepository } from '../../../domain/services/repositories/user-repository';
import { UserFactory } from './user-factory';

const testData = [
    {
        input: { name: 'overwritten' }, 
        expectation: {
            password: 'userpassword',
            name: 'overwritten',
            email: 'email@test.dev',
            registrationDate: new Date('2022-11-10')
        },
    },
    {
        input: { email: 'email@test.dev.ca' }, 
        expectation: {
            password: 'userpassword',
            name: 'username',
            email: 'email@test.dev.ca',
            registrationDate: new Date('2022-11-10')
        },
    },
    {
        input: { registrationDate: new Date('2022-10-10') }, 
        expectation: {
            password: 'userpassword',
            name: 'username',
            email: 'email@test.dev',
            registrationDate: new Date('2022-10-10')
        },
    },
    {
        input: { 
            name: 'overwritten', 
            email: 'email@test.dev.ca'
        }, 
        expectation: {
            password: 'userpassword',
            name: 'overwritten',
            email: 'email@test.dev.ca',
            registrationDate: new Date('2022-11-10')
        },
    },
    {
        input: { 
            name: 'overwritten', 
            email: 'email@test.dev.ca', 
            registrationDate: new Date('2022-10-10')
        }, 
        expectation: {
            password: 'userpassword',
            name: 'overwritten',
            email: 'email@test.dev.ca',
            registrationDate: new Date('2022-10-10')
        },
    },
];

const makeFakeRepo = () => ({} as UserRepository);

describe('UserFactory', () => {

    describe('make method', () => {
        const fakeRepo = makeFakeRepo();
        const sut = new UserFactory(fakeRepo);

        it('should should merge data with the defaults when when making a record', () => {
            const result = sut.make({});
            expect(result).toEqual(UserFactory.defaults);
        });
    
        describe.each(testData)('should merge data with the defaults', ({ input, expectation}) => {
            it('should should merge name field with the defaults when when making a record', () => {
                const result = sut.make(input);
                expect(result).toEqual(expectation);
            });
        });
    });

    describe('create method', () => {
        it('should make the object before calling repository', async () => {
            const input: Partial<Omit<User, 'id'>> = { name: 'changed' };
            const fakeRepo = makeFakeRepo();
            fakeRepo.storeUser = jest.fn();
            const createSpy = jest.spyOn(fakeRepo, 'storeUser');
            
            const sut = new UserFactory(fakeRepo);

            await sut.create(input);

            expect(createSpy).toHaveBeenCalledWith(sut.make(input));
        });
    });
});
