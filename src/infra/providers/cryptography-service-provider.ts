import { container } from 'tsyringe';
import { Environment } from '../../config/environment';
import { Encrypter } from '../../domain/services/cryptography/encrypter';
import { Hash, HashCheck, HashMake } from '../../domain/services/cryptography/hash';
import { ServiceProvider } from '../../domain/services/provider';
import { BcryptAdapter } from '../../utils/bcrypt-adapter';
import { JwtAdapter } from '../../utils/jwt-adapter';

export class CryptographyServiceProvider implements ServiceProvider {
    public register(): void {
        this.registerHash();
        this.registerJwt();
    }

    private registerHash(): void {
        const bcryptAdapter = new BcryptAdapter(container.resolve("HashSalt"));
        container.registerInstance<HashMake>("HashMake", bcryptAdapter);
        container.registerInstance<HashCheck>("HashCheck", bcryptAdapter);
        container.registerInstance<Hash>("Hash", bcryptAdapter);
    }

    private registerJwt(): void {
        const jwtEncrypter = new JwtAdapter(container.resolve("AppSecret"));
        container.registerInstance<Encrypter>("Encrypter", jwtEncrypter);
    }
}