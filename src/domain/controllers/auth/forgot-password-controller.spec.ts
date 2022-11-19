import { AppError } from "../../exceptions/app-error";
import { Validator } from "../../services/validation/validator";
import { UseCase } from "../../use-cases/use-case";
import { ForgotPasswordController } from "./forgot-password-controller";

describe('ForgotPasswordController', () => {
    it('should throw if validation throws', () => {
        const useCase: UseCase = { execute: jest.fn() };
        const validator: Validator = { 
            validate: jest.fn().mockImplementationOnce(() => {
                throw new AppError('Hypothetical Error');
            })
        } as unknown as Validator;

        const sut = new ForgotPasswordController(useCase, validator);
        const handlePromise = sut.handle({
            body: { input: 'value' }
        });

        expect(handlePromise).rejects.toThrow();
    });

    it('should throw if usecase throws', () => {
        const validator: Validator = { validate: jest.fn() } as unknown as Validator;
        const useCase: UseCase = { 
            execute: jest.fn().mockImplementationOnce(() => {
                throw new AppError('Hypothetical Error');
            })
        };

        const sut = new ForgotPasswordController(useCase, validator);
        const handlePromise = sut.handle({
            body: { input: 'value' }
        });

        expect(handlePromise).rejects.toThrow();
    });

    it('should forward call into validator with correct values', async () => {
        const validator: Validator = { validate: jest.fn() } as unknown as Validator;
        const useCase: UseCase = { execute: jest.fn() };

        const validateSpy = jest.spyOn(validator, 'validate');

        const sut = new ForgotPasswordController(useCase, validator);
        
        await sut.handle({
            body: { input: 'value' }
        });

        expect(validateSpy).toHaveBeenCalledWith({ input: 'value' });
    });

    it('should forward call into usecase with correct values', async () => {
        const validator: Validator = { validate: jest.fn() } as unknown as Validator;
        const useCase: UseCase = { execute: jest.fn() };

        const executeSpy = jest.spyOn(useCase, 'execute');

        const sut = new ForgotPasswordController(useCase, validator);
        
        await sut.handle({
            body: { input: 'value' }
        });

        expect(executeSpy).toHaveBeenCalledWith({ input: 'value' });
    });
});