import { AppError } from "../../../domain/exceptions/app-error";
import { IsEmailRule } from "./is-email-rule";

const invalidEmails = [
    'invalid',
    'invalid.com',
    'invalid_email.com',
    'invalid@test',
    'invalid@.test',
];

const validEmails = [
    'valid@test.com',
    'valid@test.com.br',
    'valid@test.ca',
    'valid.test@test.dev',
    'valid_test@test.dev',
    'valid_test@test.dev',
    'valid@many.levels.of.depth.in.domain',
];

describe('IsEmailRule', () => {
    describe.each(invalidEmails)('Invalid emails', (invalidEmail) => {
        it(`should return an AppError if input is invalid (${invalidEmail})`, () => {
            const sut = new IsEmailRule('email');

            const error = sut.applyRule({ email: invalidEmail });

            expect(error).toBeDefined();
            expect(error).toBeInstanceOf(AppError);
        });
    });

    describe.each(validEmails)('Valid emails', (validEmail) => {
        it(`should not return an error if input is valid (${validEmail})`, () => {
            const sut = new IsEmailRule('email');

            const error = sut.applyRule({ email: validEmail });

            expect(error).not.toBeDefined();
        });
    });
});
