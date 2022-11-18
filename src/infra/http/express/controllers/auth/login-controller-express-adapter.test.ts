import request from "supertest";
import { container } from 'tsyringe';
import { Db, MongoClient } from "mongodb";
import { Environment } from "../../../../../config/environment";
import { HttpStatus } from "../../../../../domain/services/http/status";
import { MessageProducer } from "../../../../../domain/services/messaging/message-producer";
import { HashMake } from "../../../../../domain/services/cryptography/hash";
import { AbstractFactory } from "../../../../database/factories/abstract-factory";
import { User } from "../../../../../domain/entities/user";
import { MongoUserRepository } from "../../../../database/mongo/repositories/mongo-user-repository";

const defaults = {
    password: "userpassword",
    name: "username",
    email: "email@test.dev",
    registrationDate: new Date('2022-11-10')
}

describe('Sign Up API', () => {
    const fakeProducer: MessageProducer = { publish: jest.fn() };
    container.registerInstance("MessageProducer", fakeProducer);
    const api = global.expressTestServer;
    const client = container.resolve(MongoClient);
    const db: Db = container.resolve('MongoDatabaseConnection');
    const userRepo = new MongoUserRepository();
    const userFactory = new AbstractFactory<User>(defaults, userRepo);
    const hash: HashMake = container.resolve('HashMake');
    Environment.APP_DEBUG = false;
    
    const makeRequest = async (data: object) => await request(api).post('/auth/login').send(data);
    const makeUser = async () => {
        return await userFactory.create({ password: await hash.make("userpassword"), name: "username", email: "email@test.dev", registrationDate: new Date() });
    }

    beforeAll(async () => {
        await client.connect();
    });

    afterAll(async () => {
        await client.close();
    });

    beforeEach(async () => {
        await db.dropDatabase();
        await makeUser();
    });

    it('should return an error if provided credentials are invalid', async () => {
        const response = await makeRequest({ email: 'email@test.dev', password: 'wrong'});
        expect(response.statusCode).toBe(HttpStatus.BAD_REQUEST);
        expect(response.body.error).toBeDefined();
        expect(response.body.accessToken).not.toBeDefined();
    });

    it('should return an access token if provided credentials are valid', async () => {
        const response = await makeRequest({ email: 'email@test.dev', password: 'userpassword'});
        expect(response.statusCode).toBe(HttpStatus.OK);
        expect(response.body.accessToken).toBeDefined();
    });
});