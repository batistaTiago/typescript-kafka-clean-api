import request from 'supertest';
import { MongoClient } from 'mongodb';
import { MongoUserRepository } from '../../../infra/database/mongo/repositories/mongo-user-repository';
import { Environment } from '../../../config/environment';
import { HttpStatus } from '../../services/http/status';
import { container } from 'tsyringe';
import { UserRepository } from '../../services/repositories/user-repository';
import { AbstractFactory } from '../../../infra/database/factories/abstract-factory';
import { User } from '../../entities/user';
import { HashMake } from '../../services/cryptography/hash';

const defaults = {
    password: "userpassword",
    name: "username",
    email: "email@test.dev",
    registrationDate: new Date('2022-11-10')
}

const api = global.expressTestServer;

describe('Find User Controller', () => {
    const client = container.resolve(MongoClient);
    const db = client.db(container.resolve('MongoDatabaseName'));
    const userRepo = new MongoUserRepository();
    const userFactory = new AbstractFactory<User>(defaults, userRepo);
    const hashMake: HashMake = container.resolve('HashMake');
    const email = 'email@test.dev';
    const password = 'ValidPassword123!';

    const getAuthString = async () => {
        const loginResponse = await request(api)
            .post('/auth/login')
            .send({ email, password });
    
        return `Bearer ${loginResponse.body.accessToken}`;
    }

    const makeRequest = async (id: string, authString?: string) => {
        const req = request(api).get(`/users/${id}`);
        
        if (authString) {
            req.set('Authorization', authString);
        }

        return await req;
    }
    
    beforeAll(async () => {
        await client.connect();
    });

    afterAll(async () => {
        await client.close();
    });

    beforeEach(async () => {
        await db.dropDatabase();
    });

    it('should provide an endpoint to find an user by id', async () => {
        const { id } = await userFactory.create({ email, password: await hashMake.make(password) });
        const response = await makeRequest(id, await getAuthString());

        expect(response.status).toBe(HttpStatus.OK);
        expect(response.body.error).not.toBeDefined();

        expect(response.body.id).toEqual(id);
        expect(response.body.name).toEqual('username');
        expect(response.body.email).toEqual('email@test.dev');
    });

    it('should return 401 if user no token is sent', async () => {
        const { id } = await userFactory.create({ email, password: await hashMake.make(password) });
        const response = await makeRequest(id);

        expect(response.status).toBe(HttpStatus.UNAUTHORIZED);
        expect(response.body.error).toBeDefined();
    });

    it('should enable cors in this route', async () => {
        const { id } = await userFactory.create({ email, password: await hashMake.make(password) });
        await (request(api).get(`/users/${id}`).expect('access-control-allow-origin', '*'));
    });
});
