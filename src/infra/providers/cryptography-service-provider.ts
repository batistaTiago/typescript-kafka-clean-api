import { container } from 'tsyringe';
import { Environment } from '../../config/environment';
import { Encrypter } from '../../domain/services/cryptography/encrypter';
import { HashCheck, HashMake } from '../../domain/services/cryptography/hash';
import { ServiceProvider } from '../../domain/services/provider';
import { BcryptAdapter } from '../../utils/bcrypt-adapter';

export class CryptographyServiceProvider implements ServiceProvider {
    public register(): void {
        container.register("HashSalt", { useValue: Environment.APP_SALT_ROUNDS });
        container.register("AppSecret", { useValue: Environment.APP_SECRET_KEY });
        
        const bcryptAdapter = new BcryptAdapter(container.resolve("HashSalt"), container.resolve("AppSecret"));
        
        container.registerInstance<HashMake>("HashMake", bcryptAdapter);
        container.registerInstance<HashCheck>("HashCheck", bcryptAdapter);
        container.registerInstance<Encrypter>("Encrypter", bcryptAdapter);
    }
}