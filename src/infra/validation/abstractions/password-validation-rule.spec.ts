import { AppError } from "../../../domain/exceptions/app-error";
import { PasswordValidationRule } from "./password-validation-rule";

const invalidPasswords = [
    'invalid',
    'invalid.password',
    'TH!S P4SSW0RD IS T0O D4MN FR34K1NG lONG MAAAAAAAN',
    'N0Sp3c1aLCH4RF0UND',
];

const validPasswords = [
    'ValidPassword123!',
    'TH1S !S V4l!D',
    'valid@Passw0rd.ca',
    'HOWEVER, TH!S P4SSW0RD IS VAl1D'
];

describe('PasswordValidationRule', () => {
    describe.each(invalidPasswords)('Invalid passwords', (invalidPassword) => {
        it(`should return an AppError if input is invalid (${invalidPassword})`, () => {
            const sut = new PasswordValidationRule('password');

            const error = sut.applyRule({ password: invalidPassword });

            expect(error).toBeDefined();
            expect(error).toBeInstanceOf(AppError);
        });
    });

    describe.each(validPasswords)('Valid passwords', (validPassword) => {
        it(`should not return an error if input is valid (${validPassword})`, () => {
            const sut = new PasswordValidationRule('password');

            const error = sut.applyRule({ password: validPassword });

            expect(error).not.toBeDefined();
        });
    });
});
