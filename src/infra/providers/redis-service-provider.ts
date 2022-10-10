import { container } from 'tsyringe';
import Environment from '../../application/environment';
import { ServiceProvider } from '../../domain/services/provider';
import { createClient } from 'redis';
import { RedisClientType } from '@redis/client';

import { promisifyAll } from 'bluebird';
promisifyAll(createClient);

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

const client = createClient(buildConnectionParams());

export class RedisServiceProvider implements ServiceProvider {

    public async register(): Promise<void> {   
        container.registerInstance(RedisClientType, client);
    }
}