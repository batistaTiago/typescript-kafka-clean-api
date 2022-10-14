import * as Providers from '../infra/providers';

export abstract class Application {
    public constructor() {
        Providers.registerAll();
    }

    public abstract start(): Promise<void>;
}