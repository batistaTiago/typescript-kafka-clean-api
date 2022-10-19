import { container } from 'tsyringe';
import { ServiceProvider } from '../../domain/services/provider';
import { EventRepository } from '../../domain/services/repositories/event-repository';
import { UserRepository } from '../../domain/services/repositories/user-repository';
import { VerificationCodeRepository } from '../../domain/services/repositories/verification-code-repository ';
import { MongoEventRepository } from '../database/mongo/repositories/mongo-event-repository';
import { MongoUserRepository } from '../database/mongo/repositories/mongo-user-repository';
import { MongoVerificationCodeRepository } from '../database/mongo/repositories/mongo-verification-code-repository';
import { MysqlEventRepository } from '../database/mysql/repositories/mysql-event-repository';
import { MysqlUserRepository } from '../database/mysql/repositories/mysql-user-repository';

export class RepositoryServiceProvider implements ServiceProvider {
    public async register(): Promise<void> {
        // container.register<EventRepository>("EventRepository", { useClass: MongoEventRepository });
        container.register<EventRepository>("EventRepository", { useClass: MysqlEventRepository });
        
        container.register<VerificationCodeRepository>("VerificationCodeRepository", { useClass: MongoVerificationCodeRepository });

        // container.register<UserRepository>("UserRepository", { useClass: MongoUserRepository });
        container.register<UserRepository>("UserRepository", { useClass: MysqlUserRepository });
    }
}