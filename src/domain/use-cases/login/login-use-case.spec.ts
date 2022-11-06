import { AppError } from "../../exceptions/app-error";
import { Encrypter } from "../../services/cryptography/encrypter";
import { HashCheck } from "../../services/cryptography/hash";
import { AccountRepository } from "../../services/repositories/user-repository";
import { LoginUseCase } from "./login-use-case";

const makeRepo = () => ({ findAccountByEmail: jest.fn().mockResolvedValue({ id: 'user-id', password: 'userpassword' }) } as unknown as AccountRepository);
const makeHash = () => ({ check: jest.fn().mockReturnValue(true) } as unknown as HashCheck);
const makeEncrypter = () => ({ encrypt: jest.fn().mockResolvedValue('hashed') } as unknown as Encrypter);

const fakeDate = new Date('2022-11-06');
jest.spyOn<any, any>(global, 'Date').mockReturnValue(fakeDate);

describe('LoginUseCase', () => {
    it('should call its components once each with correct values', async () => {
        const repo = makeRepo();
        const hash = makeHash();
        const encrypter = makeEncrypter();
        const sut = new LoginUseCase(repo, hash, encrypter);

        const findSpy = jest.spyOn(repo, 'findAccountByEmail');
        const checkSpy = jest.spyOn(hash, 'check');
        const encryptSpy = jest.spyOn(encrypter, 'encrypt');

        await sut.execute({ email: 'email@test.dev', password: 'userpassword' });

        expect(findSpy).toHaveBeenCalledWith('email@test.dev');
        expect(checkSpy).toHaveBeenCalledWith('userpassword', 'userpassword');
        expect(encryptSpy).toHaveBeenCalledWith({ id: 'user-id', issuedAt: fakeDate });
    });

    it('should throw an error if passwords do not match', () => {
        const repo = makeRepo();
        const hash = makeHash();
        const encrypter = makeEncrypter();
        hash.check = jest.fn().mockResolvedValueOnce(false);

        const sut = new LoginUseCase(repo, hash, encrypter);

        const executionPromise = sut.execute({ email: 'email@test.dev', password: 'userpassword' });

        expect(executionPromise).rejects.toThrow(new AppError('Unauthorized'));
    });
});
