import request from 'supertest';
import { MongoClient } from 'mongodb';
import { MongoUserRepository } from '../../../infra/database/mongo/repositories/mongo-user-repository';
import { Environment } from '../../../config/environment';
import { HttpStatus } from '../../services/http/status';
import { container } from 'tsyringe';
import { UserRepository } from '../../services/repositories/user-repository';
import { Authentication } from '../../services/auth/authentication';
import { generateAccessToken } from '../../../utils/access-token-generator';

describe('Find User Controller', () => {
    const client = new MongoClient(Environment.MONGO_CONNECTION_URI);
    const db = client.db(container.resolve('MongoDatabaseName'));
    const userRepo = new MongoUserRepository(client);
    container.registerInstance<UserRepository>('UserRepository', userRepo);

    beforeAll(async () => {
        await userRepo.connect();
    });

    afterAll(async () => {
        await userRepo.disconnect();
    });

    beforeEach(async () => {
        await db.dropDatabase();
    });

    it.skip('should provide an endpoint to find an user by id', async () => {
        const user = {
            id: 'user-id',
            name: 'username',
            email: 'unexisting-email@test.dev',
            registrationDate: new Date()
        };

        const auth = { user: () => user } as unknown as Authentication;
        
        container.registerInstance(Authentication, auth);

        const date = new Date();
        const insertResult = await userRepo.storeUser({
            password: '123456',
            name: 'test',
            email: 'email@test.dev',
            registrationDate: date,
        });

        const token = generateAccessToken(user);

        const response = await request(global.expressTestServer)
            .get(`/users/${insertResult.id}`)
            .set('Authorization', `Bearer ${token}`)

            expect(response.status).toBe(HttpStatus.OK);
            expect(response.body.id).toEqual(insertResult.id);
            expect(response.body.name).toEqual('test');
            expect(response.body.email).toEqual('email@test.dev');
            expect(response.body.registrationDate).toEqual(date.toISOString());
    });
});
