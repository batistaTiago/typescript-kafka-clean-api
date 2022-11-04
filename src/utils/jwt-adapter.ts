import { inject, injectable } from 'tsyringe';
import { Encrypter } from '../domain/services/cryptography/encrypter';
import * as jwt from 'jsonwebtoken'

@injectable()
export class JwtAdapter implements Encrypter {
    public constructor(@inject('AppSecret') private readonly secret: string) { }
    
    public encrypt(data: string | object): string {
        const text = String(typeof data === 'object' ? JSON.stringify(data) : data);
        return jwt.sign(text, this.secret);
    }

    public decrypt(text: string): any {
        return jwt.verify(text, this.secret);
    }
}
