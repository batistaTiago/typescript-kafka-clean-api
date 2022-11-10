import { MongoClient } from 'mongodb';
import request from 'supertest';
import { container } from 'tsyringe';
import { Environment } from '../../../../../config/environment';
import { HashMake } from '../../../../../domain/services/cryptography/hash';
import { MessageProducer } from '../../../../../domain/services/messaging/message-producer';
import { generateAccessToken } from '../../../../../utils/access-token-generator';
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

    beforeAll(async () => {
        await client.connect();
    });

    afterAll(async () => {
        await client.close();
    });

    beforeEach(async () => {
        await db.dropDatabase();
    });

    it('should return 400 if attempting to update the password without sending the current password', async () => {
        const user = await factory.create({});
        const authString = `Bearer ${generateAccessToken(user)}`;

        const response = await request(api)
            .post('/auth/update')
            .send({
                "password": "new_password"
            })
            .set('Authorization', authString);


        console.log(response.body);
        expect(response.body.error).toBeDefined();
    });

    it('should return 400 if attempting to update the email to an invalid email', async () => {
        const user = await factory.create({});
        const authString = `Bearer ${generateAccessToken(user)}`;

        const response = await request(api)
            .post('/auth/update')
            .send({
                "email": "invalid email"
            })
            .set('Authorization', authString);


        console.log(response.body);
        expect(response.body.error).toBeDefined();
    });

    it('should return 400 if attempting to update the password without a password confirmation', async () => {
        const user = await factory.create({
            password: "ValidPassword123!"
        });
        const authString = `Bearer ${generateAccessToken(user)}`;

        const response = await request(api)
            .post('/auth/update')
            .send({
                "password": "new_password",
                "current_password": "ValidPassword123!"
            })
            .set('Authorization', authString);


        console.log(response.body);
        expect(response.body.error).toBeDefined();
    });

    it('should return 400 if attempting to update the password with an incorrect current password', async () => {
        const user = await factory.create({
            password: "ValidPassword123!"
        });
        const authString = `Bearer ${generateAccessToken(user)}`;

        const response = await request(api)
            .post('/auth/update')
            .send({
                "password": "new_password",
                "password_confirmation": "new_password",
                "current_password": "ValidPassword123"
            })
            .set('Authorization', authString);


        console.log(response.body);
        expect(response.body.error).toBeDefined();
    });

    it('should return 400 if attempting to update the password to an invalid password', async () => {
        const user = await factory.create({
            password: "ValidPassword123!"
        });
        const authString = `Bearer ${generateAccessToken(user)}`;

        const response = await request(api)
            .post('/auth/update')
            .send({
                "password": "123456",
                "password_confirmation": "123456",
                "current_password": "ValidPassword123!"
            })
            .set('Authorization', authString);


        console.log(response.body);
        expect(response.body.error).toBeDefined();
    });

    it('should update the password if correct current password and confirmation are provided', async () => {
        const user = await factory.create({
            password: await hashMake.make("ValidPassword123!")
        });
        const authString = `Bearer ${generateAccessToken(user)}`;

        const response = await request(api)
            .post('/auth/update')
            .send({
                "password": "ValidPassword123!!",
                "password_confirmation": "ValidPassword123!!",
                "current_password": "ValidPassword123!"
            })
            .set('Authorization', authString);


        expect(response.body.error).toBeUndefined();
    });
});