import * as Providers from '../infra/providers';
export abstract class Application {
    public constructor() {
        this.bootServices();
    }

    private bootServices() {
        Providers.registerAll();
    }

    public abstract start(): Promise<void>;
}