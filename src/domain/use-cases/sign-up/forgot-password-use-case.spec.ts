import { RandomHelper } from "../../../utils/random-helper";
import { Mailer } from "../../services/mailing/mailer";
import { PasswordRecoveryRepository } from "../../services/repositories/password-recovery-repository";
import { UserRepository } from "../../services/repositories/user-repository";
import { ForgotPasswordUseCase } from "./forgot-password-use-case";

const email = 'email@test.dev';

const makeUser = () => ({
    name: 'username',
    email,
    password: 'pass',
    registrationDate: new Date('2022-11-19'),
});

describe('ForgotPasswordUseCase', () => {
    it('should call userRepository findByEmail with correct values', async () => {
        const user = makeUser();
        const userRepository = { findByEmail: jest.fn().mockResolvedValueOnce(user) } as unknown as UserRepository;
        const passwordRecoveryRepository = { storeRecovery: jest.fn() } as unknown as PasswordRecoveryRepository;
        const mailer = { send: jest.fn() } as unknown as Mailer;
        const randomHelper = { pick: jest.fn().mockReturnValue('0') } as unknown as RandomHelper;

        const sut = new ForgotPasswordUseCase(userRepository, passwordRecoveryRepository, mailer, randomHelper);

        const findByEmailSpy = jest.spyOn(userRepository, 'findByEmail');

        await sut.execute({ email });

        expect(findByEmailSpy).toHaveBeenCalledWith(email);
    });

    it('should call passwordRecoveryRepository storeRecovery with correct values', async () => {
        const user = makeUser();
        const userRepository = { findByEmail: jest.fn().mockResolvedValueOnce(user) } as unknown as UserRepository;
        const passwordRecoveryRepository = { storeRecovery: jest.fn() } as unknown as PasswordRecoveryRepository;
        const mailer = { send: jest.fn() } as unknown as Mailer;
        const randomHelper = { pick: jest.fn().mockReturnValue('0') } as unknown as RandomHelper;

        const sut = new ForgotPasswordUseCase(userRepository, passwordRecoveryRepository, mailer, randomHelper);

        const storeRecoverySpy = jest.spyOn(passwordRecoveryRepository, 'storeRecovery');

        await sut.execute({ email });

        expect(storeRecoverySpy).toHaveBeenCalledWith({ code: '00000000', user, used: false, expiresAt: expect.any(Date) });
    });

    it('should call mailer send with correct values', async () => {
        const user = makeUser();
        const userRepository = { findByEmail: jest.fn().mockResolvedValueOnce(user) } as unknown as UserRepository;
        const passwordRecoveryRepository = { storeRecovery: jest.fn() } as unknown as PasswordRecoveryRepository;
        const mailer = { send: jest.fn() } as unknown as Mailer;
        const randomHelper = { pick: jest.fn().mockReturnValue('0') } as unknown as RandomHelper;

        const sut = new ForgotPasswordUseCase(userRepository, passwordRecoveryRepository, mailer, randomHelper);

        const sendSpy = jest.spyOn(mailer, 'send');

        await sut.execute({ email });

        expect(sendSpy).toHaveBeenCalledWith(expect.any(Object), email);
    });
});