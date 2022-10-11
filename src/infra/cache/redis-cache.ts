import { Cache } from "../../domain/services/cache/cache";
import { inject, singleton } from "tsyringe";
import { RedisClientType } from '@redis/client';

@singleton()
export class RedisCache implements Cache {
    private isConnected: boolean = false;

    public constructor(@inject("RedisClientType") private readonly client: RedisClientType) {
        this.client.on('connect', () => this.isConnected = true);
        this.client.on('disconnect', () => this.isConnected = false);
    }

    private async connect(): Promise<void> {
        await this.client.connect();
    }

    public async has(key: string): Promise<boolean> {
        if (!this.isConnected) {
            this.connect();
        }

        return !!(await this.client.get(key));
    }

    public async get(key: string): Promise<string|object|null> {
        if (!this.isConnected) {
            this.connect();
        }

        const value = await this.client.get(key);

        try {
            return JSON.parse(value);
        } catch (error) {
            return value;
        }
    }
    
    public async set(key: string, data: string|object): Promise<void> {
        if (!this.isConnected) {
            this.connect();
        }

        if (!data) {
            await this.client.set(key, null);
            return;
        }

        if (typeof data === 'string') {
            await this.client.set(key, data);
            return;
        }

        await this.client.set(key, JSON.stringify(data));
    }
    
    public async forget(key: string): Promise<void> {
        if (!this.isConnected) {
            this.connect();
        }

        this.set(key, null);
    }
}
