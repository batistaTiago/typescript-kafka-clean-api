import request from "supertest";
import { container } from 'tsyringe';
import { MongoClient } from "mongodb";
import { Environment } from "../../../../../config/environment";
import { HttpStatus } from "../../../../../domain/services/http/status";
import { MessageProducer } from "../../../../../domain/services/messaging/message-producer";
import { HashCheck } from "../../../../../domain/services/cryptography/hash";

describe('Sign Up API', () => {
    const fakeProducer: MessageProducer = { publish: jest.fn() };
    container.registerInstance("MessageProducer", fakeProducer);
    const api = global.expressTestServer;
    const client = container.resolve(MongoClient);
    Environment.APP_DEBUG = false;
    
    const makeRequest = async (data: object) => await request(api).post('/auth/sign-up').send(data);

    beforeAll(async () => {
        await client.connect();
    });

    afterAll(async () => {
        await client.close();
    });

    beforeEach(async () => {
        await client.db().dropDatabase();
    });

    it('should insert a user in the database', async () => {
        expect(await client.db().collection('users').countDocuments()).toBe(0);

        const response = await makeRequest({
            email: 'email@test.dev',
            name: 'username',
            password: 'userpassword',
            password_confirmation: 'userpassword',
        });

        expect(response.statusCode).toBe(HttpStatus.OK);

        const record = await client.db().collection('users').findOne({ email: 'email@test.dev' });

        expect(record).toBeTruthy();
    });

    it('should not insert the password_confirmation in the database', async () => {
        expect(await client.db().collection('users').countDocuments()).toBe(0);

        const response = await makeRequest({
            email: 'email@test.dev',
            name: 'username',
            password: 'userpassword',
            password_confirmation: 'userpassword',
        });

        expect(response.statusCode).toBe(HttpStatus.OK);

        const record = await client.db().collection('users').findOne({ email: 'email@test.dev' });
        expect(record.password_confirmation).toBeUndefined();
    });

    it('should now insert a duplicate email in the database', async () => {
        expect(await client.db().collection('users').countDocuments()).toBe(0);

        const response = await makeRequest({
            email: 'email@test.dev',
            name: 'username',
            password: 'userpassword',
            password_confirmation: 'userpassword',
        });

        expect(response.statusCode).toBe(HttpStatus.OK);

        const secondResponse = await makeRequest({
            email: 'email@test.dev',
            name: 'username',
            password: 'userpassword',
            password_confirmation: 'userpassword',
        });

        expect(secondResponse.statusCode).toBe(HttpStatus.BAD_REQUEST);

        expect(await client.db().collection('users').countDocuments()).toBe(1);
    });

    it('should encrypt the password before saving it to the database ', async () => {
        expect(await client.db().collection('users').countDocuments()).toBe(0);

        const response = await makeRequest({
            email: 'email@test.dev',
            name: 'username',
            password: 'userpassword',
            password_confirmation: 'userpassword',
        });

        expect(response.statusCode).toBe(HttpStatus.OK);

        const record = await client.db().collection('users').findOne({ email: 'email@test.dev' });

        const hashCheck: HashCheck = container.resolve('HashCheck');

        expect(await hashCheck.check('userpassword', record.password));
    });
});