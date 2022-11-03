import { BcryptAdapter } from './bcrypt-adapter';
import bcrypt from 'bcrypt';

const UNHASHED_STRING = 'UNHASHED_STRING';
const UNHASHED_OBJECT = { sample: 'object', with: ['many', 'layers', 'of', 'depth']};
const HASHED_VALUE = 'THIS_HAS_BEEN_HASHED';
const SALT = 2;

describe('BcryptAdapter', () => {
    it("it should return bcrypt's hash call's result regardless of input type being string or object", async () => {
        bcrypt.hash = jest.fn().mockReturnValue(HASHED_VALUE);
        const sut = new BcryptAdapter(SALT);
        expect(await sut.make(UNHASHED_STRING)).toEqual(HASHED_VALUE);
        expect(await sut.make(UNHASHED_OBJECT)).toEqual(HASHED_VALUE);
    });

    it("it should call bcrypt's hash method with correct values", async () => {
        const hashSpy = jest.spyOn(bcrypt, 'hash');
        const sut = new BcryptAdapter(SALT);
        await sut.make(UNHASHED_STRING);
        expect(hashSpy).toBeCalledWith(UNHASHED_STRING, SALT);
    });

    it("it should serialize objects as JSON before forwarding calls to bcrypt", async () => {
        const hashSpy = jest.spyOn(bcrypt, 'hash');
        const sut = new BcryptAdapter(SALT);
        await sut.make(UNHASHED_OBJECT);
        expect(hashSpy).toBeCalledWith(JSON.stringify(UNHASHED_OBJECT), SALT);
    });
});