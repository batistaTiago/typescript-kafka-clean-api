import { AppError } from "../../exceptions/app-error";
import { Validator } from "../../services/validation/validator";
import { SignUpUseCase } from "../../use-cases/sign-up/sign-up-use-case";
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

const makeUseCase = () => ({ execute: jest.fn() } as unknown as SignUpUseCase);
const makeValidator = () => ({ validate: jest.fn() } as unknown as Validator);

describe("SignUpController", () => {
    it('should call usecase with correct values', async () => {
        const useCase = makeUseCase();
        const sut = new SignUpController(useCase, makeValidator());
        const executeSpy = jest.spyOn(useCase, 'execute');

        const request = getBaseRequest();
        await sut.handle(request);

        expect(executeSpy).toHaveBeenCalledWith({
            ...request.body,
            registrationDate: new Date()
        });
    });

    it('should call validator with correct values', async () => {
        const validator = makeValidator();
        const sut = new SignUpController(makeUseCase(), validator);
        const validateSpy = jest.spyOn(validator, 'validate');

        const request = getBaseRequest();
        await sut.handle(request);

        expect(validateSpy).toHaveBeenCalledWith({
            ...request.body
        });
    });
});
