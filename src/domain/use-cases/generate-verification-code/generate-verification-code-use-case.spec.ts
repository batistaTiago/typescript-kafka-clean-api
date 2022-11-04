import { User } from "../../entities/user";
import { GenerateVerificationCodeUseCase } from "./generate-verification-code-use-case";

const makeGenerator = () => ({ generate: jest.fn() });
const makeVerificationCodeRepository = () => ({ storeValidationCode: jest.fn(), findByUser: jest.fn() });

describe('GenerateVerificationCodeUseCase', () => {
    it('should not call its generator if email exists', async () => {
        const generator = makeGenerator();
        const verificationCodeRepository = makeVerificationCodeRepository();

        const generatorSpy = jest.spyOn(generator, 'generate');

        const sut = new GenerateVerificationCodeUseCase(
            verificationCodeRepository, 
            generator
        );

        await sut.execute({ 
            name: 'username',
            email: 'email@test.dev',
            registrationDate: new Date()
        });
        
        expect(generatorSpy).not.toHaveBeenCalled();
    });

    it('should call its generator if email does not exist', async () => {
        const generator = makeGenerator();
        const verificationCodeRepository = makeVerificationCodeRepository();

        verificationCodeRepository.findByUser = jest.fn().mockImplementation(() => {
            throw new Error();
        });

        const generatorSpy = jest.spyOn(generator, 'generate');

        const sut = new GenerateVerificationCodeUseCase(
            verificationCodeRepository, 
            generator
        );

        await sut.execute({ 
            name: 'username',
            email: 'unexisting-email@test.dev',
            registrationDate: new Date()
        });

        expect(generatorSpy).toHaveBeenCalled();
    });

    it('should call its repository', async () => {
        const generator = makeGenerator();
        const verificationCodeRepository = makeVerificationCodeRepository();

        verificationCodeRepository.findByUser = jest.fn().mockImplementation(() => {
            throw new Error();
        });

        const storeSpy = jest.spyOn(verificationCodeRepository, 'storeValidationCode');

        const sut = new GenerateVerificationCodeUseCase(
            verificationCodeRepository, 
            generator
        );

        await sut.execute({ 
            name: 'username',
            email: 'unexisting-email@test.dev',
            registrationDate: new Date()
        });
        
        expect(storeSpy).toHaveBeenCalled();
    });
});
