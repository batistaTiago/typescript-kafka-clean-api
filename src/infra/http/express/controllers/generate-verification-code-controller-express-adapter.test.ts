import request from "supertest";
import { UserFactory } from "../../../database/factories/user-factory";
import { container } from 'tsyringe';
import { MongoClient } from "mongodb";
import { Environment } from "../../../../config/environment";
import { HttpStatus } from "../../../../domain/services/http/status";
import { HashMake } from "../../../../domain/services/cryptography/hash";

describe('Code Generation API', () => {
    const api = global.expressTestServer;
    const client = container.resolve(MongoClient);
    const db = client.db(container.resolve('MongoDatabaseName'));
    const factory = new UserFactory();
    Environment.APP_DEBUG = false;
    const hashMake: HashMake = container.resolve('HashMake');

    const name = "testuser";
    const registrationDate = new Date();
    const email = 'email@test.dev';
    const password = 'ValidPassword123!';

    const getAuthString = async () => {
        const loginResponse = await request(api)
            .post('/auth/login')
            .send({ email, password });

        return `Bearer ${loginResponse.body.accessToken}`;
    }
    
    const makeRequest = async (authString: string = null) => await request(api).get('/verification-code').set('Authorization', (authString ?? (await getAuthString())));

    beforeAll(async () => {
        await client.connect();
    });

    afterAll(async () => {
        await client.close();
    });

    beforeEach(async () => {
        await db.dropDatabase();
        await factory.create({ name, email, registrationDate, password: await hashMake.make(password) });
    });

    // it('should enable cors in this route', async () => {
    //     await (request(api).get('/verification-code').expect('access-control-allow-origin', '*'));
    // });

    it('should return unauthenticated if no token is provided', async () => {
        const response = await request(api).get('/verification-code');

        expect(response.statusCode).toBe(HttpStatus.UNAUTHORIZED);
        expect(response.body.error).toBeDefined();
        expect(response.body.error).toEqual('Unauthorized');
        expect(response.body.code).not.toBeDefined();
        expect(response.body.expiresAt).not.toBeDefined();
    });

    it('should return unauthenticated if a invalid token is provided', async () => {
        const response = await makeRequest('abcd');

        expect(response.statusCode).toBe(HttpStatus.UNAUTHORIZED);
        expect(response.body.error).toBeDefined();
        expect(response.body.error).toEqual('Unauthorized');
        expect(response.body.code).not.toBeDefined();
        expect(response.body.expiresAt).not.toBeDefined();
    });

    it('should create a record in the database for the current user', async () => {
        const response = await makeRequest();

        expect(response.statusCode).toBe(HttpStatus.OK);
        
        const verificationCode = await db.collection('verification_codes').findOne({ code: response.body.code, "user.email": 'email@test.dev' });

        expect(verificationCode).toBeTruthy();
    });

    it('should return a verification same code for that user', async () => {
        const response = await makeRequest();
        expect(response.statusCode).toBe(HttpStatus.OK);

        expect(response.body.code).toBeDefined();
        expect(response.body.expiresAt).toBeDefined();
    });

    it('should return the same code if called twice in a row', async () => {
        const [ response, secondResponse ] = await Promise.all([makeRequest(), makeRequest()]);
        expect(response.statusCode).toBe(HttpStatus.OK);
        expect(secondResponse.statusCode).toBe(HttpStatus.OK);

        expect(response.body.code).toBeDefined();
        expect(response.body.expiresAt).toBeDefined();
        expect(secondResponse.body.code).toEqual(response.body.code);
        expect(secondResponse.body.expiresAt).toEqual(response.body.expiresAt);
    });

    it('should create a single record in the database for the current user even if called multiple times', async () => {
        expect((await db.collection('verification_codes').find({}).toArray()).length).toEqual(0);

        expect((await makeRequest()).statusCode).toBe(HttpStatus.OK);
        expect((await makeRequest()).statusCode).toBe(HttpStatus.OK);

        const verificationCodes = await db.collection('verification_codes').find({ "user.email": 'email@test.dev' }).toArray();

        expect(verificationCodes.length).toEqual(1);
    });
});