import { VerificationCodeModel } from "../../dto/verification-code-model";
import { RandomNumberGenerator } from "../../../utils/random-number-generator";
import { VerificationCode } from "../../entities/verification-code";
import { Cache } from "../../services/cache/cache";
import { VerificationCodeRepository } from "../../services/repositories/verification-code-repository ";
import { GenerateVerificationCodeUseCase } from "./generate-verification-code-use-case";

const makeGenerator = () => ({ generate: jest.fn() });
const makeUserRepository = () => ({ storeUser: jest.fn(), findById: jest.fn(), findByEmail: jest.fn() });
const makeVerificationCodeRepository = () => ({ storeValidationCode: jest.fn(), findByUser: jest.fn() });

describe('GenerateVerificationCodeUseCase', () => {
    it('should not call its generator if email exists', async () => {
        const generator = makeGenerator();
        const userRepository = makeUserRepository();
        const verificationCodeRepository = makeVerificationCodeRepository();

        const generatorSpy = jest.spyOn(generator, 'generate');

        const sut = new GenerateVerificationCodeUseCase(
            userRepository, 
            verificationCodeRepository, 
            generator
        );

        await sut.execute({ email: 'email@test.dev' });
        expect(generatorSpy).not.toHaveBeenCalled();
    });

    it('should call its generator if email does not exist', async () => {
        const generator = makeGenerator();
        const userRepository = makeUserRepository();
        const verificationCodeRepository = makeVerificationCodeRepository();

        verificationCodeRepository.findByUser = jest.fn().mockImplementation(() => {
            throw new Error();
        });

        const generatorSpy = jest.spyOn(generator, 'generate');

        const sut = new GenerateVerificationCodeUseCase(
            userRepository, 
            verificationCodeRepository, 
            generator
        );

        await sut.execute({ email: 'unexisting-email@test.dev' });
        expect(generatorSpy).toHaveBeenCalled();
    });

    it('should call its repository', async () => {
        const generator = makeGenerator();
        const userRepository = makeUserRepository();
        const verificationCodeRepository = makeVerificationCodeRepository();

        verificationCodeRepository.findByUser = jest.fn().mockImplementation(() => {
            throw new Error();
        });

        const storeSpy = jest.spyOn(verificationCodeRepository, 'storeValidationCode');

        const sut = new GenerateVerificationCodeUseCase(
            userRepository, 
            verificationCodeRepository, 
            generator
        );

        await sut.execute({ email: 'unexisting-email@test.dev' });
        
        expect(storeSpy).toHaveBeenCalled();
    });
});
