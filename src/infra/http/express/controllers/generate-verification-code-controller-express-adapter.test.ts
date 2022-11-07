import request from "supertest";
import { UserFactory } from "../../../database/factories/user-factory";
import { Encrypter } from "../../../../domain/services/cryptography/encrypter";
import { container } from 'tsyringe';
import { MongoClient } from "mongodb";
import { Environment } from "../../../../config/environment";

describe('Code Generation API', () => {
    const jwt: Encrypter = container.resolve('Encrypter');
    const api = global.expressTestServer;
    const client = container.resolve(MongoClient);
    const factory = new UserFactory();
    Environment.APP_DEBUG = false;
    
    const makeRequest = async (token: string) => await request(api).get('/verification-code').set('Authorization', `Bearer ${token}`);

    beforeAll(async () => {
        await client.connect();
    });

    afterAll(async () => {
        await client.close();
    });

    beforeEach(async () => {
        await client.db().dropDatabase();
    });

    // it.skip('should call the authentication middleware', async () => {
    //     const middleware = container.resolve(AuthenticateUser);
    //     const applySpy = jest.spyOn(middleware, 'apply');
    //     await request(api)
    //         .get('/verification-code');

    //     expect(applySpy).toHaveBeenCalled();
    // });

    it('should return unauthenticated if no token is provided', async () => {
        const response = await request(api).get('/verification-code');

        expect(response.statusCode).toBe(401);
        expect(response.body.error).toBeDefined();
        expect(response.body.error).toEqual('Unauthorized');
        expect(response.body.code).not.toBeDefined();
        expect(response.body.expiresAt).not.toBeDefined();
    });

    it('should return unauthenticated if a invalid token is provided', async () => {
        const response = await makeRequest('abcd');

        expect(response.statusCode).toBe(401);
        expect(response.body.error).toBeDefined();
        expect(response.body.error).toEqual('Unauthorized');
        expect(response.body.code).not.toBeDefined();
        expect(response.body.expiresAt).not.toBeDefined();
    });

    it('should create a record in the database for the current user', async () => {
        const user = await factory.create({
            name: "testuser",
            email: "test@email.dev",
            registrationDate: new Date(),
            password: "userpassword",
        });

        const token = jwt.encrypt({ id: user.id, issuedAt: new Date() });

        const response = await makeRequest(token);
        expect(response.statusCode).toBe(200);
        
        const verificationCode = await client.db().collection('verification_codes').findOne({ code: response.body.code, "user.email": 'test@email.dev' });

        expect(verificationCode).toBeTruthy();
    });

    it('should return a verification same code for that user', async () => {
        const user = await factory.create({
            name: "testuser",
            email: "test@email.dev",
            registrationDate: new Date(),
            password: "userpassword",
        });

        const token = jwt.encrypt({ id: user.id, issuedAt: new Date() });

        const response = await makeRequest(token);
        expect(response.statusCode).toBe(200);

        expect(response.body.code).toBeDefined();
        expect(response.body.expiresAt).toBeDefined();
    });

    it('should return the same code if called twice in a row', async () => {
        const user = await factory.create({
            name: "testuser",
            email: "test@email.dev",
            registrationDate: new Date(),
            password: "userpassword",
        });

        const token = jwt.encrypt({ id: user.id, issuedAt: new Date() });

        const [ response, secondResponse ] = await Promise.all([makeRequest(token), makeRequest(token)]);
        expect(response.statusCode).toBe(200);
        expect(secondResponse.statusCode).toBe(200);

        expect(response.body.code).toBeDefined();
        expect(response.body.expiresAt).toBeDefined();
        expect(secondResponse.body.code).toEqual(response.body.code);
        expect(secondResponse.body.expiresAt).toEqual(response.body.expiresAt);
    });

    it('should create a single record in the database for the current user even if called multiple times', async () => {
        const user = await factory.create({
            name: "testuser",
            email: "test@email.dev",
            registrationDate: new Date(),
            password: "userpassword",
        });

        const token = jwt.encrypt({ id: user.id, issuedAt: new Date() });

        expect((await client.db().collection('verification_codes').find({}).toArray()).length).toEqual(0);

        expect((await makeRequest(token)).statusCode).toBe(200);
        expect((await makeRequest(token)).statusCode).toBe(200);

        const verificationCodes = await client.db().collection('verification_codes').find({ "user.email": 'test@email.dev' }).toArray();

        expect(verificationCodes.length).toEqual(1);
    });
});