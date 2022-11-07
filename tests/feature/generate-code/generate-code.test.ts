import request from "supertest";
import { UserFactory } from "../../../src/infra/database/factories/user-factory";
import { Encrypter } from "../../../src/domain/services/cryptography/encrypter";
import { container } from 'tsyringe';
import { MongoClient } from "mongodb";
import { Environment } from "../../../src/config/environment";
import { AuthenticateUser } from '../../../src/infra/http/express/middleware/authenticate-user';

const jwt: Encrypter = container.resolve('Encrypter');
const api = global.expressTestServer;
const client = new MongoClient(Environment.MONGO_CONNECTION_URI as any);
const factory = new UserFactory();
Environment.APP_DEBUG = false;

const makeRequest = async (token: string) => await request(api).get('/verification-code').set('Authorization', `Bearer ${token}`);

describe('Code Generation API', () => {
    beforeEach(async () => {
        await client.db().dropDatabase();
    });

    it.skip('should call the authentication middleware', async () => {
        const middleware = container.resolve(AuthenticateUser);
        const applySpy = jest.spyOn(middleware, 'apply');
        await request(api)
            .get('/verification-code');

        expect(applySpy).toHaveBeenCalled();
    });

    it('should return unauthenticated if no token is provided', async () => {
        const response = await request(api).get('/verification-code');

        expect(response.body.error).toBeDefined();
        expect(response.body.error).toEqual('Unauthorized');
        expect(response.body.code).not.toBeDefined();
        expect(response.body.expiresAt).not.toBeDefined();
    });

    it('should return unauthenticated if a invalid token is provided', async () => {
        const response = await makeRequest('abcd');

        expect(response.body.error).toBeDefined();
        expect(response.body.error).toEqual('Unauthorized');
        expect(response.body.code).not.toBeDefined();
        expect(response.body.expiresAt).not.toBeDefined();
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

        expect(response.body.code).toBeDefined();
        expect(response.body.expiresAt).toBeDefined();
        expect(secondResponse.body.code).toEqual(response.body.code);
        expect(secondResponse.body.expiresAt).toEqual(response.body.expiresAt);
    });
});