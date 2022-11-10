import request from 'supertest';
import { UserFactory } from '../../../../database/factories/user-factory';

describe('Update Account API', () => {

    const factory = new UserFactory();
    it('should return 400 if attempting to update the password without sending the current password', async () => {
        // const user = factory.create();
    });
});