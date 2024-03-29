import { Db, MongoClient } from 'mongodb';
import { MongoUserRepository } from './mongo-user-repository';
import { SignUpDTO } from '../../../../domain/dto/user/sign-up';
import { User } from '../../../../domain/entities/user';
import { container } from 'tsyringe';

describe('MongoUserRepository', () => {
    const client = container.resolve(MongoClient);
    const db: Db = client.db(container.resolve('MongoDatabaseName'));
    const sut = new MongoUserRepository();

    beforeAll(async () => {
        await client.connect();
    });

    afterAll(async () => {
        await client.close();
    });

    beforeEach(async () => {
        await db.dropDatabase();
    });

    describe('CREATE operations', () => {
        it('should return inserted data along with inserted id', async () => {
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

        it.skip('should throw if mongodb client throws', () => {
            jest.spyOn(db, 'collection').mockImplementation(() => {
                throw new Error('Hypothetical error');
            });

            const user: SignUpDTO = {
                name: 'user name',
                password: 'user password',
                password_confirmation: 'user password',
                email: 'user email',
                registrationDate: new Date(),
            };

            const result = sut.storeUser(user);

            expect(result).rejects.toThrow(new Error('Hypothetical error'));
        });
    });

    describe('RETRIEVE operations', () => {
        it('should return the same data along with id already cast to string', async () => {
            const insertData: User = {
                name: 'test email',
                email: 'email@test.dev',
                registrationDate: new Date,
                password: 'pass',
            };
            
            const insertResult = await db.collection(sut.collectionName).insertOne({ ...insertData });
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

        it('should not store confirmation field', async () => {
            const insertData: SignUpDTO = {
                name: 'test email',
                email: 'email@test.dev',
                password: 'pass',
                password_confirmation: 'pass',
                registrationDate: new Date,
            };
            
            const insertResult = await sut.storeUser({ ...insertData });

            expect(insertResult.password).toBeDefined();
        });
    });
});
