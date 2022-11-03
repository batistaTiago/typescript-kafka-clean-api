import { container } from 'tsyringe';
import { Encrypter } from '../../domain/services/cryptography/encrypter';
import { HashCheck, HashMake } from '../../domain/services/cryptography/hash';
import { ServiceProvider } from '../../domain/services/provider';
import { BcryptAdapter } from '../../utils/bcrypt-adapter';

export class CryptographyServiceProvider implements ServiceProvider {
    public register(): void {
        const bcryptAdapter = new BcryptAdapter();
        container.registerInstance<HashMake>("HashMake", bcryptAdapter);
        container.registerInstance<HashCheck>("HashCheck", bcryptAdapter);
        container.registerInstance<Encrypter>("Encrypter", bcryptAdapter);
        container.registerInstance<Encrypter>("Encrypter", bcryptAdapter);
    }
}