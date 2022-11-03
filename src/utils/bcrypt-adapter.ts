import * as bcrypt from 'bcrypt';
import { injectable } from 'tsyringe';
import { Environment } from '../config/environment';
import { Encrypter } from '../domain/services/cryptography/encrypter';
import { Hash } from '../domain/services/cryptography/hash';

@injectable()
export class BcryptAdapter implements Encrypter, Hash {
    public async decrypt(text: string): Promise<string | object> {
        throw new Error('Method not implemented.');
        return '';
    }

    public async make(text: string | object): Promise<string> {
        if (typeof text === 'object') {
            text = JSON.stringify(text);
        }

        return await bcrypt.hash(String(text), Environment.APP_SALT_ROUNDS);
    }

    public async check(value: string, hash: string): Promise<boolean> {
        throw new Error('Method not implemented.');
        return true;
    }

    public async encrypt(text: string | object): Promise<string> {
        throw new Error('Method not implemented.');
        return '';
    }
}
