import { MongoClient } from 'mongodb';
import request from 'supertest';
import { container } from 'tsyringe';
import { UserFactory } from '../../../../database/factories/user-factory';
import nodemailer from 'nodemailer';
import { Environment } from '../../../../../config/environment';
import { HttpStatus } from '../../../../../domain/services/http/status';

describe('Forgot Password API', () => {
    const api = global.expressTestServer;
    const factory = new UserFactory();
    const mailer: nodemailer.Transporter = container.resolve('NodeMailerTransport');
    mailer.sendMail = jest.fn();
    const client = container.resolve(MongoClient);
    const db = client.db(container.resolve('MongoDatabaseName'));
    const email = 'test@email.dev';

    beforeAll(async () => {
        await client.connect();
    });

    afterAll(async () => {
        await client.close();
    });

    beforeEach(async () => {
        await db.dropDatabase();
        jest.clearAllMocks();
        await factory.create({ email });
    });

    it('should return 400 if email is invalid', async () => {
        const response = await request(api).post('/auth/forgot-password').send({ email: 'invalid_email' });
        expect(response.statusCode).toBe(HttpStatus.BAD_REQUEST);
        expect(response.body.error).toBeDefined();
    });

    it('should return 400 if user is not in the userbase', async () => {
        const response = await request(api).post('/auth/forgot-password').send({ email: 'unexisting@test.dev' });
        expect(response.statusCode).toBe(HttpStatus.BAD_REQUEST);
        expect(response.body.error).toBeDefined();
    });

    it('should return 200 if feature recovery request is successful', async () => {
        const response = await request(api).post('/auth/forgot-password').send({ email });

        expect(response.statusCode).toBe(200);
        expect(response.body.error).not.toBeDefined();
    });

    it('should insert a record in the database if the user exists', async () => {
        await request(api).post('/auth/forgot-password').send({ email });


        const totalCount = await db.collection('password-recoveries').countDocuments();
        expect(totalCount).toBe(1);
    });

    it('should send an email to the user with the code', async () => {
        const sendMailSpy = jest.spyOn(mailer, 'sendMail');

        await request(api).post('/auth/forgot-password').send({ email });


        expect(sendMailSpy).toHaveBeenCalledWith({
            from: Environment.MAIL_FROM,
            html: expect.any(String),
            subject: "Forgot your password?",
            to: email,
        });
    });
});
