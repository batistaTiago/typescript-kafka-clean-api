import { inject, injectable } from 'tsyringe';
import { Encrypter } from '../domain/services/cryptography/encrypter';
import * as jwt from 'jsonwebtoken'

@injectable()
export class JwtAdapter implements Encrypter {
    public constructor(@inject('AppSecret') private readonly secret: string) { }
    
    public encrypt(data: string | object): string {
        return jwt.sign(data, this.secret);
    }

    public decrypt(text: string): string | object {
        return jwt.verify(text, this.secret);
    }
}
