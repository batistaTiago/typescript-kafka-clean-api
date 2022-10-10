import { MongoClient } from 'mongodb';
import { container } from 'tsyringe';
import Environment from '../../application/environment';
import { ServiceProvider } from '../../domain/services/provider';

export class MongoServiceProvider implements ServiceProvider {
    public async register(): Promise<void> {   
        container.registerInstance(MongoClient, new MongoClient(Environment.MONGO_CONNECTION_URI));
    }
}