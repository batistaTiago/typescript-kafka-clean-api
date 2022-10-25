import 'reflect-metadata';
import * as Express from 'express';
import { ApiApplication } from './src/application/api-application';

class TestApplication extends ApiApplication {
    public constructor() {
        super();
    }

    public start(): Promise<void> { 
        return null;
    }

    public getExpress(): Express.Application {
        return this.api;
    }
}

// @@TODO: ver um jeito melhor de fazer esse bootstrap dos servicos
global.expressTestServer = new TestApplication().getExpress();
