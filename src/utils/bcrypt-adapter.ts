import * as bcrypt from 'bcrypt';
import { injectable } from 'tsyringe';
import Environment from "../application/environment";
import { Encrypter } from '../domain/services/cryptography/encrypter';

@injectable()
export class BcryptAdapter implements Encrypter {
    public async encrypt(text: string | object): Promise<string> {
        if (typeof text === 'object') {
            text = JSON.stringify(text);
        }

        return await bcrypt.hash(String(text), Environment.APP_SALT_ROUNDS);
    }
}
