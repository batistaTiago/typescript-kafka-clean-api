import { Db, MongoClient } from 'mongodb';
import { container } from 'tsyringe';
import { Environment } from '../../config/environment';
import { ServiceProvider } from '../../domain/services/provider';

export class MongoServiceProvider implements ServiceProvider {
    public register(): void {
        const client = new MongoClient(container.resolve('MongoConnectionUrl'));
        const connection: Db = client.db(container.resolve('MongoDatabaseName'));

        container.registerInstance(MongoClient, client);
        container.registerInstance('MongoDatabaseConnection', connection);
    }
}