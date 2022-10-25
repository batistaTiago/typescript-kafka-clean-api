import { AppError } from "../exceptions/app-error";
import { SignUpUseCase } from "../use-cases/sign-up/sign-up-use-case";
import { SignUpController } from "./sign-up-controller";

const testData = [
    { missingParamName: "email" },
    { missingParamName: "name" },
    { missingParamName: "password" },
    { missingParamName: "password_confirmation" },
];

const getBaseRequest = () => ({
    body: {
        email: "test@email.dev",
        name: "test name",
        password: "the_user_password",
        password_confirmation: "the_user_password",
    },
});

const mockedDate = new Date('2022-10-10');
jest.spyOn<any, any>(global, 'Date').mockImplementation(() => {
    return mockedDate;
});

describe("SignUpController", () => {
    describe.each(testData)("Missing parameters validation", (data) => {
        const sut = new SignUpController({ execute: jest.fn() } as unknown as SignUpUseCase);
        it(`should throw an error if ${data.missingParamName} parameter is missing`, () => {
            const request = getBaseRequest();
            delete request.body[data.missingParamName];
            expect(sut.handle(request)).rejects.toThrow(AppError);
        });
    });

    describe("Parameter values validation", () => {
        const sut = new SignUpController({ execute: jest.fn() } as unknown as SignUpUseCase);
        it(`should throw an error if password and confirmation do not match`, () => {            
            const request = getBaseRequest();
            request.body.password_confirmation = 'the user password';
            expect(sut.handle(request)).rejects.toThrow(new AppError(`Passwords do not match`));
        });

        it(`should throw an error if email is not valid`, () => {            
            const request = getBaseRequest();
            request.body.email = 'invalid email';
            expect(sut.handle(request)).rejects.toThrow(new AppError(`Invalid param: email`));
        });
    });

    it('should forward call to usecase', async () => {
        const useCase = { execute: jest.fn() } as unknown as SignUpUseCase;
        const sut = new SignUpController(useCase);
        const executeSpy = jest.spyOn(useCase, 'execute');

        const request = getBaseRequest();
        await sut.handle(request);

        expect(executeSpy).toHaveBeenCalledWith({
            ...request.body,
            registrationDate: new Date()
        });
    });
});
