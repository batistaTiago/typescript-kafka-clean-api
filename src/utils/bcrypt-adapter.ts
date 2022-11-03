import * as bcrypt from 'bcrypt';
import { inject, injectable } from 'tsyringe';
import { Encrypter } from '../domain/services/cryptography/encrypter';
import { Hash } from '../domain/services/cryptography/hash';

@injectable()
export class BcryptAdapter implements Encrypter, Hash {
    public constructor(
        @inject('HashSalt') private readonly salt: number,
        @inject('AppSecret') private readonly secret: string,
    ) { }
    
    public async make(text: string | object): Promise<string> {
        if (typeof text === 'object') {
            text = JSON.stringify(text);
        }

        return await bcrypt.hash(String(text), this.salt);
    }

    public async check(value: string, hash: string): Promise<boolean> {
        return await bcrypt.compare(value, hash);
    }

    public async encrypt(text: string | object): Promise<string> {
        throw new Error('Method not implemented.');
        return '';
    }

    public async decrypt(text: string): Promise<string | object> {
        throw new Error('Method not implemented.');
        return '';
    }
}
