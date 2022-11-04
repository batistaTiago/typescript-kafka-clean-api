import request from 'supertest';
import { MongoClient } from 'mongodb';
import { MongoUserRepository } from '../../infra/database/mongo/repositories/mongo-user-repository';
import { Environment } from '../../config/environment';
import { HttpStatus } from '../services/http/status';
import { container } from 'tsyringe';
import { UserRepository } from '../services/repositories/user-repository';
import { Authentication } from '../services/auth/authentication';

describe('Find User Controller', () => {
    const client = new MongoClient(Environment.MONGO_CONNECTION_URI);
    const userRepo = new MongoUserRepository(client);
    container.registerInstance<UserRepository>('UserRepository', userRepo)

    beforeAll(async () => {
        await userRepo.connect();
    });

    afterAll(async () => {
        await userRepo.disconnect();
    });

    beforeEach(async () => {
        await userRepo.client.db().dropDatabase();
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
            password_confirmation: '123456',
            name: 'test',
            email: 'email@test.dev',
            registrationDate: date,
        });

        await request(global.expressTestServer)
            .get(`/users/${insertResult.id}`)
            .expect((response) => {
                expect(response.status).toBe(HttpStatus.OK);
                expect(response.body.id).toEqual(insertResult.id);
                expect(response.body.name).toEqual('test');
                expect(response.body.email).toEqual('email@test.dev');
                expect(response.body.registrationDate).toEqual(date.toISOString());
            });
    });
});
