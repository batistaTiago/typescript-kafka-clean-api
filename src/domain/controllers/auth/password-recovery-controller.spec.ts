import { AppError } from "../../exceptions/app-error";
import { Validator } from "../../services/validation/validator";
import { UseCase } from "../../use-cases/use-case";
import { PasswordRecoveryController } from "./password-recovery-controller";

describe('PasswordRecoveryController', () => {
    it('should throw if validation throws', () => {
        const useCase: UseCase = { execute: jest.fn() };
        const validator: Validator = { 
            validate: jest.fn().mockImplementationOnce(() => {
                throw new AppError('Hypothetical Error');
            })
        } as unknown as Validator;

        const sut = new PasswordRecoveryController(useCase, validator);
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

        const sut = new PasswordRecoveryController(useCase, validator);
        const handlePromise = sut.handle({
            body: { input: 'value' }
        });

        expect(handlePromise).rejects.toThrow();
    });

    it('should forward call into validator with correct values', async () => {
        const validator: Validator = { validate: jest.fn() } as unknown as Validator;
        const useCase: UseCase = { execute: jest.fn() };

        const validateSpy = jest.spyOn(validator, 'validate');

        const sut = new PasswordRecoveryController(useCase, validator);
        
        await sut.handle({
            body: { input: 'value' }
        });

        expect(validateSpy).toHaveBeenCalledWith({ input: 'value' });
    });

    it('should forward call into usecase with correct values', async () => {
        const validator: Validator = { validate: jest.fn() } as unknown as Validator;
        const useCase: UseCase = { execute: jest.fn() };

        const executeSpy = jest.spyOn(useCase, 'execute');

        const sut = new PasswordRecoveryController(useCase, validator);
        
        await sut.handle({
            body: { input: 'value' }
        });

        expect(executeSpy).toHaveBeenCalledWith({ input: 'value' });
    });
});