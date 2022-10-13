import { container } from 'tsyringe';
import { Encrypter } from '../../domain/services/cryptography/encrypter';
import { ServiceProvider } from '../../domain/services/provider';
import { BcryptAdapter } from '../../utils/bcrypt-adapter';

export class CryptographyServiceProvider implements ServiceProvider {
    public async register(): Promise<void> {
        container.registerInstance("Encrypter", BcryptAdapter);
    }
}