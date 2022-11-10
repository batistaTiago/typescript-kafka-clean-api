import { AppError } from "../../../domain/exceptions/app-error";
import { MaxLengthRule } from "./max-length-rule";

const invalidParams = [
    '1234567',
    'abcdefgh',
    '123defg45',
    'abc123g45xy',
    '125612312457',
    'bsa76567as5bc',
    'a67bs7861x76212',
];

const validParams = [
    '',
    '1',
    '1x',
    '123',
    '12z4',
    '1234d',
    '1234de',
    '52b41',
    '5321',
    '6m3',
    '2,7',
];

describe('MaxLengthRule', () => {
    const maxLength = 6;
    
    describe.each(invalidParams)('Invalid parameters', (invalidString) => {
        it(`should return an AppError if field is ${invalidString.length} characters long`, () => {
            const sut = new MaxLengthRule('param', maxLength);

            const error = sut.applyRule({ param: invalidString });

            expect(error).toBeDefined();
            expect(error).toBeInstanceOf(AppError);
        });
    });

    describe.each(validParams)('Valid parameters', (validString) => {
        it(`should not return an AppError if field is ${validString.length} characters long`, () => {
            const sut = new MaxLengthRule('param', maxLength);

            const error = sut.applyRule({ param: validString });

            expect(error).not.toBeDefined();
        });
    });
});
