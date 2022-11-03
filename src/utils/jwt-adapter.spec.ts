import jwt from 'jsonwebtoken';
import { JwtAdapter } from './jwt-adapter';

const UNENCRYPTED_STRING = 'UNENCRYPTED_STRING';
const UNENCRYPTED_OBJECT = { sample: 'object', with: ['many', 'layers', 'of', 'depth']};
const HASHED_VALUE = 'THIS_HAS_BEEN_HASHED';
const SECRET = 'abc';

describe('JwtAdapter', () => {
    it("it should return jwt's sign call's result regardless of input type being string or object", () => {
        jwt.sign = jest.fn().mockReturnValue(HASHED_VALUE);
        const sut = new JwtAdapter(SECRET);
        expect(sut.encrypt(UNENCRYPTED_STRING)).toEqual(HASHED_VALUE);
        expect(sut.encrypt(UNENCRYPTED_STRING)).toEqual(HASHED_VALUE);
    });

    it("it should call jwt's sign method with correct values", () => {
        const signSpy = jest.spyOn(jwt, 'sign');
        const sut = new JwtAdapter(SECRET);
        sut.encrypt(UNENCRYPTED_STRING);
        expect(signSpy).toBeCalledWith(UNENCRYPTED_STRING, SECRET);
    });

    it("it should serialize objects as JSON before forwarding calls to jwt", () => {
        const signSpy = jest.spyOn(jwt, 'sign');
        const sut = new JwtAdapter(SECRET);
        sut.encrypt(UNENCRYPTED_OBJECT);
        expect(signSpy).toBeCalledWith(JSON.stringify(UNENCRYPTED_OBJECT), SECRET);
    });
});