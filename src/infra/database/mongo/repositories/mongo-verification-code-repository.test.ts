import { MongoClient } from 'mongodb';
import { Environment } from '../../../../config/environment';
import { VerificationCode } from '../../../../domain/entities/verification-code';
import { RandomHelper } from '../../../../utils/random-helper';
import { MongoVerificationCodeRepository } from './mongo-verification-code-repository';

const fakeUserRegistrationDate = new Date('2022-07-11');
const getMockCode = () => {
    return {
        code: 'RANDOM_CODE' + `${Math.random()}`,
        expiresAt: new Date(),
        user: {
            email: 'email@test.dev',
            name: 'test name',
            registrationDate: fakeUserRegistrationDate
        }
    };
};


describe('MongoVerificationCodeRepository', () => {
    const rng = new RandomHelper();
    const testDatabaseName = `test_db_${rng.generate({ digits: 10 })}` 
    const client = new MongoClient(Environment.MONGO_CONNECTION_URI);
    const db = client.db(testDatabaseName);
    const sut = new MongoVerificationCodeRepository(client, testDatabaseName);

    beforeAll(async () => {
        await sut.connect();
    });

    afterAll(async () => {
        await sut.disconnect();
    });

    beforeEach(async () => {
        await db.dropDatabase();
    }); 

    it('should forward call to mongodb client', async () => {
        const code: VerificationCode = getMockCode()

        const result = await sut.storeValidationCode(code);

        expect((result as any)._id).not.toBeDefined();
        expect(result.id).toBeDefined();
        expect(result.code).toEqual(code.code);
    });

    it('should allow finding in direct order', async () => {
        const code: VerificationCode = getMockCode();

        await sut.storeValidationCode(code);
        await sut.storeValidationCode(getMockCode());

        const findResult = await sut.findByUser(code.user);

        expect(findResult.code).toEqual(code.code);
    });

    it('should allow finding in reverse order', async () => {
        const code: VerificationCode = getMockCode();

        await sut.storeValidationCode(getMockCode());
        await sut.storeValidationCode(code);

        const findInReverseOrderResult = await sut.findByUser(code.user, { reverse: true });

        expect(findInReverseOrderResult.code).toEqual(code.code);
    });
    
    it('should save the date in ISOString format', async () => {
        const expirationDate = new Date();
        const isoConversionSpy = jest.spyOn(expirationDate, 'toISOString');

        const code: VerificationCode = {
            code: 'RANDOM_CODE',
            expiresAt: expirationDate,
            user: {
                email: 'email@test.dev',
                name: 'test name',
                registrationDate: new Date()
            }
        };

        await sut.storeValidationCode(code);
        expect(isoConversionSpy).toHaveBeenCalled();
    });

    it('should throw if mongodb client throws', async () => {
        jest.spyOn(client, 'db').mockImplementationOnce(() => {
            throw new Error();
        });

        const code: VerificationCode = getMockCode()

        const result = sut.storeValidationCode(code);

        expect(result).rejects.toThrow();
    });
});
