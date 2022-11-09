import { container } from 'tsyringe';
import { Environment } from '../../config/environment';
import { ServiceProvider } from '../../domain/services/provider';

export class ConfigServiceProdvider implements ServiceProvider {
    public register(): void {
        container.register('MongoDatabaseName', { useValue: Environment.MONGO_DATABASE_NAME });
        container.register("HashSalt", { useValue: Environment.APP_SALT_ROUNDS });
        container.register("AppSecret", { useValue: Environment.APP_SECRET_KEY });
    }
}

