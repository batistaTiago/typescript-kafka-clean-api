import { Db, MongoClient } from 'mongodb';
import { container } from "tsyringe";
import { MongoAccessTokenRepository } from './mongo-access-token-repository';
import { AccessToken } from '../../../../domain/entities/access-token';
import { AppError } from '../../../../domain/exceptions/app-error';
import { AbstractFactory } from '../../factories/abstract-factory';

describe.skip('MongoAccessTokenRepository', () => {
    const client = container.resolve(MongoClient);
    const db: Db = client.db(container.resolve('MongoDatabaseName'));
    const sut = new MongoAccessTokenRepository();

    beforeAll(async () => {
        await client.connect();
    });

    afterAll(async () => {
        await client.close();
    });

    beforeEach(async () => {
        await db.dropDatabase();
    });

    it('should not return revoked tokens', async () => {
        const defaults: AccessToken = {
            token: 'some-token',
            userId: 'user-id',
            isRevoked: false,
            expiresAt: new Date('3022-11-29'),
        };

        const tokenFactory = new AbstractFactory<AccessToken>(defaults, sut);

        await tokenFactory.create(Object.assign({}, defaults, { isRevoked: true }));
        
        const findPromise = sut.findToken('some-token');

        expect(findPromise).rejects.toThrow(new AppError('abcdef'));
    });
});
