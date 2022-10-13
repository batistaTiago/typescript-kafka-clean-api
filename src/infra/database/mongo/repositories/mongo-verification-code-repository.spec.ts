import { MongoClient } from 'mongodb';
import { VerificationCode } from '../../../../domain/entities/verification-code';
import { MongoVerificationCodeRepository } from './mongo-verification-code-repository';

describe('MongoVerificationCodeRepository', () => {
    const client = new MongoClient(process.env.MONGO_URL);
    const sut = new MongoVerificationCodeRepository(client);

    beforeAll(async () => {
        await sut.connect();
    });

    afterAll(async () => {
        await sut.disconnect();
    });

    it('should forward call to mongodb client', async () => {
        const code: VerificationCode = {
            code: 'ABC'
        };

        const result = await sut.storeValidationCode(code);

        expect((result as any)._id).not.toBeDefined();
        expect(result.id).toBeDefined();
        expect(result.code).toEqual('ABC');
    });

    it('should throw if mongodb client throws', async () => {
        jest.spyOn(client, 'db').mockImplementationOnce(() => {
            throw new Error();
        });

        const code: VerificationCode = {
            code: 'ABC'
        };

        const result = sut.storeValidationCode(code);

        expect(result).rejects.toThrow();
    });
});
