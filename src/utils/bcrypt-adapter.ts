import * as bcrypt from 'bcrypt';
import { inject, injectable } from 'tsyringe';
import { Hash } from '../domain/services/cryptography/hash';

@injectable()
export class BcryptAdapter implements Hash {
    public constructor(@inject('HashSalt') private readonly salt: number) { }
    
    public async make(data: string | object): Promise<string> {
        const text = String(typeof data === 'object' ? JSON.stringify(data) : data);
        return await bcrypt.hash(text, this.salt);
    }

    public async check(value: string, hash: string): Promise<boolean> {
        return await bcrypt.compare(value, hash);
    }
}
