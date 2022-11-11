import { MongoClient } from 'mongodb';
import { container } from 'tsyringe';
import { Environment } from '../../config/environment';
import { ServiceProvider } from '../../domain/services/provider';
import { AccessTokenRepository } from '../../domain/services/repositories/access-token-repository';
import { EventRepository } from '../../domain/services/repositories/event-repository';
import { UserRepository } from '../../domain/services/repositories/user-repository';
import { VerificationCodeRepository } from '../../domain/services/repositories/verification-code-repository ';
import { MongoAccessTokenRepository } from '../database/mongo/repositories/mongo-access-token-repository';
import { MongoEventRepository } from '../database/mongo/repositories/mongo-event-repository';
import { MongoUserRepository } from '../database/mongo/repositories/mongo-user-repository';
import { MongoVerificationCodeRepository } from '../database/mongo/repositories/mongo-verification-code-repository';
import { MysqlEventRepository } from '../database/mysql/repositories/mysql-event-repository';
import { MysqlUserRepository } from '../database/mysql/repositories/mysql-user-repository';
import { MysqlVerificationCodeRepository } from '../database/mysql/repositories/mysql-validation-code-repository';

export class RepositoryServiceProvider implements ServiceProvider {
    public async register(): Promise<void> {
        Environment.APP_PREFERRED_DATABASE === 'mysql' ? 
            this.registerMySqlRepositories() :
            this.registerMongoRepositories();
    }

    private registerMySqlRepositories() {
        container.register<EventRepository>("EventRepository", { useClass: MysqlEventRepository });
        container.register<VerificationCodeRepository>("VerificationCodeRepository", { useClass: MysqlVerificationCodeRepository });
        // container.register<UserRepository>("UserRepository", { useClass: MysqlUserRepository });
    }

    private registerMongoRepositories() {
        const client = container.resolve(MongoClient);
        const databaseName = container.resolve('MongoDatabaseName');

        container.registerInstance<EventRepository>("EventRepository", new MongoEventRepository(client, String(databaseName)));
        container.registerInstance<VerificationCodeRepository>("VerificationCodeRepository", new MongoVerificationCodeRepository(client, String(databaseName)));
        container.registerInstance<UserRepository>("UserRepository", new MongoUserRepository(client, String(databaseName)));
        container.registerInstance<AccessTokenRepository>("AccessTokenRepository", new MongoAccessTokenRepository(client, String(databaseName)));
    }
}
