import { Environment } from "../../../config/environment";
import { AppError } from "../../exceptions/app-error";
import { Encrypter } from "../../services/cryptography/encrypter";
import { HashCheck } from "../../services/cryptography/hash";
import { AccessTokenRepository } from "../../services/repositories/access-token-repository";
import { AccountRepository } from "../../services/repositories/user-repository";
import { LoginUseCase } from "./login-use-case";

const makeAccountRepo = () => ({ findAccountByEmail: jest.fn().mockResolvedValue({ id: 'user-id', password: 'userpassword' }) } as unknown as AccountRepository);
const makeTokenRepo = () => ({ storeToken: jest.fn().mockResolvedValue({}) }) as unknown as AccessTokenRepository;
const makeHash = () => ({ check: jest.fn().mockReturnValue(true) } as unknown as HashCheck);
const makeEncrypter = () => ({ encrypt: jest.fn().mockReturnValue('hashed') } as unknown as Encrypter);

const fakeDate = new Date('2022-11-06');
jest.spyOn<any, any>(global, 'Date').mockReturnValue(fakeDate);

describe('LoginUseCase', () => {
    it('should call its components once each with correct values', async () => {
        const accountRepo = makeAccountRepo();
        const tokenRepo = makeTokenRepo();
        const hash = makeHash();
        const encrypter = makeEncrypter();
        const sut = new LoginUseCase(accountRepo, tokenRepo, hash, encrypter);
        Environment.APP_AUTH_TOKEN_DURATION_DAYS = 1;

        const findSpy = jest.spyOn(accountRepo, 'findAccountByEmail');
        const storeSpy = jest.spyOn(tokenRepo, 'storeToken');
        const checkSpy = jest.spyOn(hash, 'check');
        const encryptSpy = jest.spyOn(encrypter, 'encrypt');

        await sut.execute({ email: 'email@test.dev', password: 'userpassword' });

        expect(findSpy).toHaveBeenCalledWith('email@test.dev');
        expect(checkSpy).toHaveBeenCalledWith('userpassword', 'userpassword');
        expect(encryptSpy).toHaveBeenCalledWith({ id: 'user-id' });
        expect(storeSpy).toHaveBeenCalledWith({ token: "hashed", "isRevoked": false, expiresAt: new Date('2022-11-07') });
    });

    it('should throw an error if passwords do not match', () => {
        const accountRepo = makeAccountRepo();
        const tokenRepo = makeTokenRepo();
        const hash = makeHash();
        const encrypter = makeEncrypter();

        hash.check = jest.fn().mockResolvedValueOnce(false);
        const sut = new LoginUseCase(accountRepo, tokenRepo, hash, encrypter);

        const executionPromise = sut.execute({ email: 'email@test.dev', password: 'userpassword' });

        expect(executionPromise).rejects.toThrow(new AppError('User and/or password are incorrect'));
    });
});
