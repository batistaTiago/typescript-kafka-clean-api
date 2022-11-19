import { HashMake } from "../../services/cryptography/hash";
import { UserRepository } from "../../services/repositories/user-repository";
import { PasswordRecoveryRepository } from "../../services/repositories/password-recovery-repository";
import { PasswordRecoveryUseCase } from "./password-recovery-use-case";
import { AppError } from "../../exceptions/app-error";

const makeSampleData = () => ({
    email: "email@test.dev",
    code: "sample-code",
    password: "ValidPassword123!",
    password_confirmation: "ValidPassword123!"
});

describe('PasswordRecoveryUseCase', () => {
    it('should return an error if code is not found', () => {
        const userRepo = {} as unknown as UserRepository;
        const recoveryRepo = { findRecovery: jest.fn().mockImplementationOnce(() => {
            throw new AppError('Hypothetical error')
        }) } as unknown as PasswordRecoveryRepository;
        const hashMake = {} as unknown as HashMake;

        const sut = new PasswordRecoveryUseCase(userRepo, recoveryRepo, hashMake);

        const executePromise = sut.execute(makeSampleData());

        expect(executePromise).rejects.toThrowError();
    });

    it('should return an error if code is found but expired', () => {
        const userRepo = {} as unknown as UserRepository;
        const recoveryRepo = { 
            findRecovery: jest.fn().mockResolvedValueOnce({
                code: 'code',
                user: {},
                used: false,
                expiresAt: new Date('2020-01-01'),
            })
        } as unknown as PasswordRecoveryRepository;
        const hashMake = {} as unknown as HashMake;

        const sut = new PasswordRecoveryUseCase(userRepo, recoveryRepo, hashMake);

        const executePromise = sut.execute(makeSampleData());

        expect(executePromise).rejects.toThrow(new AppError('Invalid code, please try again'));
    });

    it('should call hash make with correct values', async () => {
        const sampleData = makeSampleData();
        const userRepo = { updateAccountByEmail: jest.fn() } as unknown as UserRepository;
        const recoveryRepo = { 
            findRecovery: jest.fn().mockResolvedValueOnce({
                code: 'code',
                user: {},
                used: false,
                expiresAt: new Date('2030-01-01'),
            }),
            markAsUsed: jest.fn()
        } as unknown as PasswordRecoveryRepository;
        const hashMake = { make: jest.fn() } as unknown as HashMake;

        const makeSpy = jest.spyOn(hashMake, 'make');

        const sut = new PasswordRecoveryUseCase(userRepo, recoveryRepo, hashMake);

        await sut.execute(sampleData);

        expect(makeSpy).toHaveBeenCalledWith(sampleData.password)
    });

    it('should call userRepository updateAccountByEmail with correct values', async () => {
        const sampleData = makeSampleData();
        const userRepo = { updateAccountByEmail: jest.fn() } as unknown as UserRepository;
        const recoveryRepo = { 
            findRecovery: jest.fn().mockResolvedValueOnce({
                code: 'code',
                user: {},
                used: false,
                expiresAt: new Date('2030-01-01'),
            }),
            markAsUsed: jest.fn()
        } as unknown as PasswordRecoveryRepository;
        const hashMake = { make: jest.fn().mockResolvedValue('hashed') } as unknown as HashMake;

        const updateSpy = jest.spyOn(userRepo, 'updateAccountByEmail');

        const sut = new PasswordRecoveryUseCase(userRepo, recoveryRepo, hashMake);

        await sut.execute(sampleData);

        expect(updateSpy).toHaveBeenCalledWith("email@test.dev", { password: 'hashed' });
    });

    it('should call passwordRecoveryRepository markAsUsed with correct values', async () => {
        const sampleData = makeSampleData();
        const userRepo = { updateAccountByEmail: jest.fn() } as unknown as UserRepository;
        const recoveryRepo = { 
            findRecovery: jest.fn().mockResolvedValueOnce({
                id: 'recovery-code-id',
                code: 'code',
                user: {},
                used: false,
                expiresAt: new Date('2030-01-01'),
            }),
            markAsUsed: jest.fn()
        } as unknown as PasswordRecoveryRepository;
        const hashMake = { make: jest.fn().mockResolvedValue('hashed') } as unknown as HashMake;

        const markAsUsedSpy = jest.spyOn(recoveryRepo, 'markAsUsed');

        const sut = new PasswordRecoveryUseCase(userRepo, recoveryRepo, hashMake);

        await sut.execute(sampleData);

        expect(markAsUsedSpy).toHaveBeenCalledWith('recovery-code-id');
    });
});