import { MongoClient } from 'mongodb';
import request from 'supertest';
import { container } from 'tsyringe';
import { UserFactory } from '../../../../database/factories/user-factory';
import nodemailer from 'nodemailer';
import { ForgotPasswordUseCase } from '../../../../../domain/use-cases/sign-up/forgot-password-use-case';
import { UserModel } from '../../../../../domain/dto/user/user-model';
import { HashCheck } from '../../../../../domain/services/cryptography/hash';
import { UserRepository } from '../../../../../domain/services/repositories/user-repository';
import { HttpStatus } from '../../../../../domain/services/http/status';

describe('Password Recovery API', () => {
    const api = global.expressTestServer;
    const factory = new UserFactory();
    const mailer: nodemailer.Transporter = container.resolve('NodeMailerTransport');
    mailer.sendMail = jest.fn();
    const client = container.resolve(MongoClient);
    const db = client.db(container.resolve('MongoDatabaseName'));
    const hashCheck: HashCheck = container.resolve('HashCheck');
    
    const email = 'email@test.dev';
    const password = 'ValidPassword123!';
    
    let user: UserModel = null;

    beforeAll(async () => {
        await client.connect();
    });

    afterAll(async () => {
        await client.close();
    });

    beforeEach(async () => {
        await db.dropDatabase();
        jest.clearAllMocks();
        user = await factory.create({ email });
    });

    const getAuthString = async () => {
        const loginResponse = await request(api)
            .post('/auth/login')
            .send({ email, password });

        return `Bearer ${loginResponse.body.accessToken}`;
    }

    it('should return 400 if code parameter is invalid', async () => {
        const res = await request(global.expressTestServer).post('/auth/password-recovery').send({
            email,
            password: 'ValidPassword1234!',
            password_confirmation: 'ValidPassword1234!',
        }).set('Authorization', await getAuthString());

        expect(res.statusCode).toBe(HttpStatus.BAD_REQUEST);
    });

    it('should return 400 if email parameter is invalid', async () => {
        const forgotPasswordUseCase = container.resolve(ForgotPasswordUseCase);
        
        await forgotPasswordUseCase.execute({ email });

        const recovery = await db.collection('password-recoveries').findOne({ "user.id": user.id });

        const res = await request(global.expressTestServer).post('/auth/password-recovery').send({
            email: 'invalid',
            code: recovery.code,
            password: 'ValidPassword1234!',
            password_confirmation: 'ValidPassword1234!',
        }).set('Authorization', await getAuthString());

        expect(res.statusCode).toBe(HttpStatus.BAD_REQUEST);
    });

    it('should return 400 if password is invalid', async () => {
        const forgotPasswordUseCase = container.resolve(ForgotPasswordUseCase);
        
        await forgotPasswordUseCase.execute({ email });

        const recovery = await db.collection('password-recoveries').findOne({ "user.id": user.id });

        const res = await request(global.expressTestServer).post('/auth/password-recovery').send({
            email: 'invalid',
            code: recovery.code,
            password: 'invalidpassword',
            password_confirmation: 'invalidpassword',
        }).set('Authorization', await getAuthString());

        expect(res.statusCode).toBe(HttpStatus.BAD_REQUEST);
    });

    it('should return 400 if password is not confirmed', async () => {
        const forgotPasswordUseCase = container.resolve(ForgotPasswordUseCase);
        
        await forgotPasswordUseCase.execute({ email });

        const recovery = await db.collection('password-recoveries').findOne({ "user.id": user.id });

        const res = await request(global.expressTestServer).post('/auth/password-recovery').send({
            email,
            code: recovery.code,
            password: 'ValidPassword1234!',
        }).set('Authorization', await getAuthString());

        expect(res.statusCode).toBe(HttpStatus.BAD_REQUEST);
    });

    it('should change the password if all parameters are correct', async () => {
        const forgotPasswordUseCase = container.resolve(ForgotPasswordUseCase);
        
        await forgotPasswordUseCase.execute({ email });

        const recovery = await db.collection('password-recoveries').findOne({ "user.id": user.id });

        await request(global.expressTestServer).post('/auth/password-recovery').send({
            email,
            code: recovery.code,
            password: 'ValidPassword1234!',
            password_confirmation: 'ValidPassword1234!',
        }).set('Authorization', await getAuthString());

        const userRepo: UserRepository = container.resolve('UserRepository');
        const userAfterRequest = await userRepo.findByEmail(email);

        const savedPassword = userAfterRequest.password;

        expect(await hashCheck.check('ValidPassword1234!', savedPassword)).toBe(true);
    });

    it('should return 200 if password is all parameters are correct', async () => {
        const forgotPasswordUseCase = container.resolve(ForgotPasswordUseCase);
        
        await forgotPasswordUseCase.execute({ email });

        const recovery = await db.collection('password-recoveries').findOne({ "user.id": user.id });

        const res = await request(global.expressTestServer).post('/auth/password-recovery').send({
            email,
            code: recovery.code,
            password: 'ValidPassword1234!',
            password_confirmation: 'ValidPassword1234!',
        }).set('Authorization', await getAuthString());

        console.log(res.body);

        expect(res.statusCode).toBe(HttpStatus.OK);
    });

    it('should mark the used code as used if password is changed successfully', async () => {
        const forgotPasswordUseCase = container.resolve(ForgotPasswordUseCase);
        
        await forgotPasswordUseCase.execute({ email });

        const recovery = await db.collection('password-recoveries').findOne({ "user.id": user.id });
        expect(recovery.used).toBe(false);

        const res = await request(global.expressTestServer).post('/auth/password-recovery').send({
            email,
            code: recovery.code,
            password: 'ValidPassword1234!',
            password_confirmation: 'ValidPassword1234!',
        }).set('Authorization', await getAuthString());

        expect(res.statusCode).toBe(HttpStatus.OK);

        const recoveryAfterUpdate = await db.collection('password-recoveries').findOne({ "user.id": user.id });

        expect(recoveryAfterUpdate.used).toBe(true);
    });

    //@@TODO: testar se so acha os used... (no teste do repo)
    //@@TODO: confirmation de senha nao esta sendo obrigatorio!
});