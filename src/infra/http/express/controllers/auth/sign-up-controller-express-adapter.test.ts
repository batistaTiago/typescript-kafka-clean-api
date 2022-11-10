import request from "supertest";
import { container } from 'tsyringe';
import { MongoClient } from "mongodb";
import { Environment } from "../../../../../config/environment";
import { HttpStatus } from "../../../../../domain/services/http/status";
import { MessageProducer } from "../../../../../domain/services/messaging/message-producer";
import { HashCheck } from "../../../../../domain/services/cryptography/hash";

const testData = [
    { missingParamName: "email" },
    { missingParamName: "name" },
    { missingParamName: "password" },
    { missingParamName: "password_confirmation" },
];

const baseRequest = () => ({
    email: "email@test.dev",
    name: "test name",
    password: "ValidPassword123!",
    password_confirmation: "ValidPassword123!",
});

describe('Sign Up API', () => {
    const fakeProducer: MessageProducer = { publish: jest.fn() };
    container.registerInstance("MessageProducer", fakeProducer);
    const api = global.expressTestServer;
    const client = container.resolve(MongoClient);
    const db = client.db(container.resolve('MongoDatabaseName'));
    Environment.APP_DEBUG = false;
    
    const makeRequest = async (data: object) => await request(api).post('/auth/sign-up').send(data);

    beforeAll(async () => {
        await client.connect();
    });

    afterAll(async () => {
        await client.close();
    });

    beforeEach(async () => {
        await db.dropDatabase();
    });

    it('should insert a user in the database', async () => {
        expect(await db.collection('users').countDocuments()).toBe(0);

        const response = await makeRequest(baseRequest());

        expect(response.statusCode).toBe(HttpStatus.OK);

        const record = await db.collection('users').findOne({ email: 'email@test.dev' });

        expect(record).toBeTruthy();
    });

    it('should not insert the password_confirmation in the database', async () => {
        expect(await db.collection('users').countDocuments()).toBe(0);

        const response = await makeRequest(baseRequest());

        expect(response.statusCode).toBe(HttpStatus.OK);

        const record = await db.collection('users').findOne({ email: 'email@test.dev' });
        expect(record.password_confirmation).toBeUndefined();
    });

    it('should now insert a duplicate email in the database', async () => {
        expect(await db.collection('users').countDocuments()).toBe(0);

        const response = await makeRequest(baseRequest());

        expect(response.statusCode).toBe(HttpStatus.OK);

        const secondResponse = await makeRequest({
            email: 'email@test.dev',
            name: 'username',
            password: 'userpassword',
            password_confirmation: 'userpassword',
        });

        expect(secondResponse.statusCode).toBe(HttpStatus.BAD_REQUEST);

        expect(await db.collection('users').countDocuments()).toBe(1);
    });

    it('should encrypt the password before saving it to the database', async () => {
        expect(await db.collection('users').countDocuments()).toBe(0);

        const response = await makeRequest(baseRequest());

        expect(response.statusCode).toBe(HttpStatus.OK);

        const record = await db.collection('users').findOne({ email: 'email@test.dev' });

        const hashCheck: HashCheck = container.resolve('HashCheck');

        expect(await hashCheck.check('userpassword', record.password));
    });

    describe.each(testData)("Missing parameters validation", (data) => {
        it(`should throw an error if ${data.missingParamName} parameter is missing`, async () => {
            const request = baseRequest();
            delete request[data.missingParamName];
            const response = await makeRequest(request);

            expect(response.statusCode).toBe(400);
            expect(response.body.error).toEqual(`Required field was not provided: ${data.missingParamName}`);
        });
    });

    describe("Parameter values validation", () => {
        it(`should respond with a bad request if password and confirmation do not match`, async () => {            
            const request = baseRequest();
            request.password_confirmation = 'mismatching passwords';

            const response = await makeRequest(request);

            expect(response.statusCode).toBe(400);
            expect(response.body.error).toEqual('Fields password and password_confirmation do not match');
        });

        it(`should respond with a bad request if email is not valid`, async () => {            
            const request = baseRequest();
            request.email = 'invalid email';
            
            const response = await makeRequest(request);

            expect(response.statusCode).toBe(400);
            expect(response.body.error).toEqual(`Invalid email: ${request.email}`);
        });
    });
});