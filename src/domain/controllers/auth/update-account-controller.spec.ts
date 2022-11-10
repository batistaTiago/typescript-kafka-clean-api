import { UserAccount } from "../../dto/user/user-account";
import { Authentication } from "../../services/auth/authentication";
import { Validator } from "../../services/validation/validator";
import { UpdateAccountUseCase } from "../../use-cases/sign-up/update-account-use-case";
import { UpdateAccountController } from "./update-account-controller";

const userAccount: UserAccount = {
    id: 'user-id',
    name: 'name',
    email: 'email@test.dev',
    password: '-',
    registrationDate: new Date()
};

const makeAuth = () => ({ user: jest.fn().mockReturnValue(userAccount) } as unknown as Authentication);

describe('UpdateAccountController', () => {
    it('should call its components with correct values', async () => {
        const useCase = { execute: jest.fn() } as unknown as UpdateAccountUseCase;
        const validator = {
            validate: jest.fn()
        } as unknown as Validator;
        const auth = makeAuth();

        const userSpy = jest.spyOn(auth, 'user');
        const executeSpy = jest.spyOn(useCase, 'execute');

        const sut = new UpdateAccountController(useCase, auth, validator);

        const body = { name: 'new-name' };
        await sut.handle({ body });

        expect(userSpy).toHaveBeenCalled();
        expect(executeSpy).toHaveBeenCalledWith({ account: userAccount, fields: body });
    });
});