import { MongoClient } from 'mongodb';
import { Environment } from "../../../../config/environment";
import { MongoUserRepository } from './mongo-user-repository';
import { SignUpDTO } from '../../../../domain/dto/sign-up';
import { User } from '../../../../domain/entities/user';

describe('MongoUserRepository', () => {
    const client = new MongoClient(Environment.MONGO_CONNECTION_URI);
    const sut = new MongoUserRepository(client);

    beforeAll(async () => {
        await sut.connect();
    });

    afterAll(async () => {
        await sut.disconnect();
    });

    beforeEach(async () => {
        await sut.client.db().dropDatabase();
    })

    describe('CREATE operations', () => {
        it('should forward call to mongodb client', async () => {
            const user: SignUpDTO = {
                name: 'user name',
                password: 'user password',
                password_confirmation: 'user password',
                email: 'user email',
                registrationDate: new Date(),
            };

            const result = await sut.storeUser(user);

            expect((result as any)._id).not.toBeDefined();
            expect(result.id).toBeDefined();
            expect(result.name).toBeDefined();
            expect(result.password).toBeDefined();
            expect(result.email).toBeDefined();
            expect(result.registrationDate).toBeDefined();
        });

        it('should throw if mongodb client throws', async () => {
            jest.spyOn(client, 'db').mockImplementationOnce(() => {
                throw new Error('Some hypothetical error');
            });

            const user: SignUpDTO = {
                name: 'user name',
                password: 'user password',
                password_confirmation: 'user password',
                email: 'user email',
                registrationDate: new Date(),
            };

            const result = sut.storeUser(user);

            expect(result).rejects.toThrow(new Error('Some hypothetical error'));
        });
    });

    describe('RETRIEVE operations', () => {
        it('should return the same data along with id already cast to string', async () => {
            const insertData: User = {
                name: 'test email',
                email: 'email@test.dev',
                registrationDate: new Date
            };
            
            const insertResult = await client.db().collection('users').insertOne({ ...insertData });
            const insertedId = String(insertResult.insertedId);

            const retrievedData = await sut.findById(insertedId);
            expect(retrievedData).toEqual({ ...insertData, id: insertedId });
        });

        it('should not insert duplicate emails', async () => {
            const insertData: SignUpDTO = {
                name: 'test email',
                email: 'email@test.dev',
                password: 'pass',
                password_confirmation: 'pass',
                registrationDate: new Date,
            };
            
            let error = null;
            await sut.storeUser({ ...insertData });
            try {
                await sut.storeUser({ ...insertData });
            } catch (e) {
                error = e;
            }

            expect(error).toEqual(new Error('This email address is already taken by another user'));
        });
    });
});
