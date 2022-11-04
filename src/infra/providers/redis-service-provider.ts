import { container } from 'tsyringe';
import { Environment } from '../../config/environment';
import { ServiceProvider } from '../../domain/services/provider';
import { createClient } from '@redis/client';

const buildConnectionParams = () => {
    const params: any = {
        socket: {
            host: Environment.REDIS_HOST,
            port: Environment.REDIS_PORT
        }
    }

    if (Environment.REDIS_PASSWORD) {
        params.password = Environment.REDIS_PASSWORD;
    }

    return params;
}

export class RedisServiceProvider implements ServiceProvider {
    public register(): void {   
        container.registerInstance("RedisClient", createClient(buildConnectionParams()));
    }
}
