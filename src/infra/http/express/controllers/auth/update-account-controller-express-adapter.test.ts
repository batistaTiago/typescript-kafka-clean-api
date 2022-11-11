import { MongoClient } from 'mongodb';
import request from 'supertest';
import { container } from 'tsyringe';
import { Environment } from '../../../../../config/environment';
import { HashMake } from '../../../../../domain/services/cryptography/hash';
import { HttpStatus } from '../../../../../domain/services/http/status';
import { MessageProducer } from '../../../../../domain/services/messaging/message-producer';
import { UserFactory } from '../../../../database/factories/user-factory';

describe('Update Account API', () => {
    const fakeProducer: MessageProducer = { publish: jest.fn() };
    container.registerInstance("MessageProducer", fakeProducer);
    const api = global.expressTestServer;
    const client = container.resolve(MongoClient);
    const db = client.db(container.resolve('MongoDatabaseName'));
    const factory = new UserFactory();
    const hashMake: HashMake = container.resolve('HashMake');
    Environment.APP_DEBUG = false;
    const email = 'email@test.dev';
    const password = 'ValidPassword123!';

    const getAuthString = async () => {
        const loginResponse = await request(api)
            .post('/auth/login')
            .send({ email, password });

        return `Bearer ${loginResponse.body.accessToken}`;
    }

    const makeRequest = async (data?: any, authString?: string) => {
        return await request(api).post('/auth/update').send(data).set('Authorization', (authString ?? (await getAuthString())));
    }

    beforeAll(async () => {
        await client.connect();
    });

    afterAll(async () => {
        await client.close();
    });

    beforeEach(async () => {
        await db.dropDatabase();
        await factory.create({ email, password: await hashMake.make(password) });
    });

    it('should return 400 if attempting to update the password without sending the current password', async () => {
        const response = await makeRequest({
            "password": "new_password"
        });

        expect(response.statusCode).toBe(HttpStatus.BAD_REQUEST);

        const errorMessage = response.body?.error?.toLowerCase();
        expect(errorMessage).toBeDefined();
        expect(errorMessage).toContain('required');
        expect(errorMessage).toContain('password');
    });

    it('should return 400 if attempting to update the email to an invalid email', async () => {
        const response = await makeRequest({
            "email": "invalid email"
        });

        expect(response.statusCode).toBe(HttpStatus.BAD_REQUEST);

        const errorMessage = response.body?.error?.toLowerCase();
        expect(errorMessage).toBeDefined();
        expect(errorMessage).toContain('invalid');
        expect(errorMessage).toContain('email');
    });

    it('should return 400 if attempting to update the password without a password confirmation', async () => {
        const response = await makeRequest({
            "password": "new_password",
            "current_password": "ValidPassword123!"
        });

        expect(response.statusCode).toBe(HttpStatus.BAD_REQUEST);

        const errorMessage = response.body?.error?.toLowerCase();
        expect(errorMessage).toBeDefined();
        expect(errorMessage).toContain('required');
        expect(errorMessage).toContain('password');
        expect(errorMessage).toContain('confirmation');
    });

    it('should return 400 if attempting to update the password with an incorrect current password', async () => {
        const response = await makeRequest({
            "password": "ValidPassword123!",
            "password_confirmation": "ValidPassword123!",
            "current_password": "ValidPassword123"
        });

        expect(response.statusCode).toBe(HttpStatus.BAD_REQUEST);

        const errorMessage = response.body?.error?.toLowerCase();
        expect(errorMessage).toBeDefined();
        expect(errorMessage).toContain('current');
        expect(errorMessage).toContain('password');
        expect(errorMessage).toContain('incorrect');
    });

    it('should return 400 if attempting to update the password to an invalid password', async () => {
        const response = await makeRequest({
            "password": "123456",
            "password_confirmation": "123456",
            "current_password": "ValidPassword123!"
        });

        expect(response.statusCode).toBe(HttpStatus.BAD_REQUEST);

        const errorMessage = response.body?.error?.toLowerCase();
        expect(errorMessage).toBeDefined();
        expect(errorMessage).toContain('uppercase');
        expect(errorMessage).toContain('lowercase');
        expect(errorMessage).toContain('special');
    });

    it('should update the password if correct current password and confirmation are provided', async () => {
        const response = await makeRequest({
            "password": "ValidPassword123!!",
            "password_confirmation": "ValidPassword123!!",
            "current_password": "ValidPassword123!"
        });

        expect(response.body.error).toBeUndefined();
    });

    it('should return 401 if attempting to update account without the bearer token', async () => {
        const response = await makeRequest({
            "password": "ValidPassword123!!",
            "password_confirmation": "ValidPassword123!!",
            "current_password": "ValidPassword123!"
        }, 'invalid auth string');

        expect(response.statusCode).toBe(HttpStatus.UNAUTHORIZED);

        const errorMessage = response.body?.error?.toLowerCase();
        expect(errorMessage).toBeDefined();
        expect(errorMessage).toContain('unauthorized');
    });
});
