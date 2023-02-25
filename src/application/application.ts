import 'reflect-metadata';
import * as Providers from '../infra/providers';

export abstract class Application {
    public constructor() {
        console.log('Initializing application...');
        Providers.registerAll();
    }

    public abstract start(): Promise<void>;
}