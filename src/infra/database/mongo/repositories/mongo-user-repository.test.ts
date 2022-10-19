import { MongoClient } from 'mongodb';
import { Environment } from "../../../../config/environment";
import { MongoUserRepository } from './mongo-user-repository';
import { SignUpDTO } from '../../../../domain/dto/sign-up';

describe('MongoUserRepository', () => {
    const client = new MongoClient(Environment.MONGO_CONNECTION_URI);
    const sut = new MongoUserRepository(client);

    beforeAll(async () => {
        await sut.connect();
    });

    afterAll(async () => {
        await sut.disconnect();
    });

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
