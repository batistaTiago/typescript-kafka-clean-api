import { User } from "../../entities/user";
import { GenerateVerificationCodeUseCase } from "./generate-verification-code-use-case";

const makeRng = () => ({ generate: jest.fn() });
const makeVerificationCodeRepository = () => ({ storeValidationCode: jest.fn(), findByUser: jest.fn() });

describe('GenerateVerificationCodeUseCase', () => {
    it('should call rng if code does not exist', async () => {
        const rng = makeRng();
        const verificationCodeRepository = makeVerificationCodeRepository();

        const rngSpy = jest.spyOn(rng, 'generate');

        const sut = new GenerateVerificationCodeUseCase(verificationCodeRepository, rng);

        await sut.execute({ name: 'username', email: 'email@test.dev', registrationDate: new Date() });
        
        expect(rngSpy).toHaveBeenCalled();
    });

    it('should call rng if code is expired', async () => {
        const rng = makeRng();
        const verificationCodeRepository = makeVerificationCodeRepository();
        
        // @@TODO: ver uma forma de dinamizar essas datas mockadas
        verificationCodeRepository.findByUser = jest.fn().mockResolvedValueOnce({ expiresAt: new Date('1970-01-01')})

        const rngSpy = jest.spyOn(rng, 'generate');

        const sut = new GenerateVerificationCodeUseCase(verificationCodeRepository, rng);

        await sut.execute({ name: 'username', email: 'email@test.dev', registrationDate: new Date() });
        
        expect(rngSpy).toHaveBeenCalled();
    });

    it('should not call rng if code is valid', async () => {
        const rng = makeRng();
        const verificationCodeRepository = makeVerificationCodeRepository();
        
        // @@TODO: ver uma forma de dinamizar essas datas mockadas
        verificationCodeRepository.findByUser = jest.fn().mockResolvedValueOnce({ expiresAt: new Date('2970-01-01')})

        const rngSpy = jest.spyOn(rng, 'generate');

        const sut = new GenerateVerificationCodeUseCase(verificationCodeRepository, rng);

        await sut.execute({ name: 'username', email: 'email@test.dev', registrationDate: new Date() });
        
        expect(rngSpy).not.toHaveBeenCalled();
    });

    // it('should call its rng if email does not exist', async () => {
    //     const rng = makeRng();
    //     const verificationCodeRepository = makeVerificationCodeRepository();

    //     verificationCodeRepository.findByUser = jest.fn().mockImplementation(() => {
    //         throw new Error();
    //     });

    //     const rngSpy = jest.spyOn(rng, 'generate');

    //     const sut = new GenerateVerificationCodeUseCase(verificationCodeRepository, rng);

    //     await sut.execute({ name: 'username', email: 'unexisting-email@test.dev', registrationDate: new Date() });

    //     expect(rngSpy).toHaveBeenCalled();
    // });

    it('should call its repository to save the recently generated code', async () => {
        const rng = makeRng();
        const verificationCodeRepository = makeVerificationCodeRepository();

        const storeSpy = jest.spyOn(verificationCodeRepository, 'storeValidationCode');

        const sut = new GenerateVerificationCodeUseCase(verificationCodeRepository, rng);

        await sut.execute({ name: 'username', email: 'unexisting-email@test.dev', registrationDate: new Date() });
        
        expect(storeSpy).toHaveBeenCalled();
    });
});
