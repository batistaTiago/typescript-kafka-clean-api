import 'reflect-metadata';
import * as Express from 'express';
import { ApiApplication } from './src/application/api-application';
import { Environment } from './src/config/environment';
import { RandomHelper } from './src/utils/random-helper';

class TestApplication extends ApiApplication {
    public constructor() {
        Environment.MONGO_DATABASE_NAME = `test_db_${new RandomHelper().generate({ digits: 5 })}`;
        super();
    }

    public async start(): Promise<void> { }

    public getExpress(): Express.Application {
        return this.api;
    }
}

// @@TODO: ver um jeito melhor de fazer esse bootstrap dos servicos
global.expressTestServer = new TestApplication().getExpress();
