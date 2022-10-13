import { BcryptAdapter } from './bcrypt-adapter';
import bcrypt from 'bcrypt';
import Environment from '../application/environment';

const UNHASHED_STRING = 'UNHASHED_STRING';
const UNHASHED_OBJECT = { sample: 'object', with: ['many', 'layers', 'of', 'depth']};
const HASHED_VALUE = 'THIS_HAS_BEEN_HASHED';

jest.mock('bcrypt', () => {
    return {
        hash: (data: string, salt: number): Promise<string> => new Promise(resolve => resolve('THIS_HAS_BEEN_HASHED')),
    };
});

describe('BcryptAdapter', () => {
    const sut = new BcryptAdapter();

    it("it should return bcrypt's hash call's result regardless of input type being string or object", async () => {
        expect(await sut.encrypt(UNHASHED_STRING)).toBe(HASHED_VALUE);
        expect(await sut.encrypt(UNHASHED_OBJECT)).toBe(HASHED_VALUE);
    });

    it("it should call bcrypt's hash method with correct values", async () => {
        const hashSpy = jest.spyOn(bcrypt, 'hash');
        await sut.encrypt(UNHASHED_STRING);
        expect(hashSpy).toBeCalledWith(UNHASHED_STRING, Environment.APP_SALT_ROUNDS);
    });

    it("it should serialize objects as JSON before forwarding calls to bcrypt", async () => {
        const hashSpy = jest.spyOn(bcrypt, 'hash');
        await sut.encrypt(UNHASHED_OBJECT);
        expect(hashSpy).toBeCalledWith(JSON.stringify(UNHASHED_OBJECT), Environment.APP_SALT_ROUNDS);
    });
});