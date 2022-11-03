import { container } from 'tsyringe';
import { Environment } from '../../config/environment';
import { Encrypter } from '../../domain/services/cryptography/encrypter';
import { HashCheck, HashMake } from '../../domain/services/cryptography/hash';
import { ServiceProvider } from '../../domain/services/provider';
import { BcryptAdapter } from '../../utils/bcrypt-adapter';
import { JwtAdapter } from '../../utils/jwt-adapter';

export class CryptographyServiceProvider implements ServiceProvider {
    public register(): void {
        this.registerHash();
        this.registerJwt();
    }

    private registerHash(): void {
        container.register("HashSalt", { useValue: Environment.APP_SALT_ROUNDS });
        const bcryptAdapter = new BcryptAdapter(container.resolve("HashSalt"));
        container.registerInstance<HashMake>("HashMake", bcryptAdapter);
        container.registerInstance<HashCheck>("HashCheck", bcryptAdapter);
    }

    private registerJwt(): void {
        container.register("AppSecret", { useValue: Environment.APP_SECRET_KEY });
        const jwtEncrypter = new JwtAdapter(container.resolve("AppSecret"));
        container.registerInstance<Encrypter>("Encrypter", jwtEncrypter);
    }
}