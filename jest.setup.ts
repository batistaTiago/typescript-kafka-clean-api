import 'reflect-metadata';
import { Application } from './src/application/application';

class TestApplication extends Application {
    public constructor() {
        super();
    }

    public start(): Promise<void> { 
        return null;
    }
}

new TestApplication();