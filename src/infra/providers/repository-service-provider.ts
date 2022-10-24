import { container } from 'tsyringe';
import { Environment } from '../../config/environment';
import { ServiceProvider } from '../../domain/services/provider';
import { EventRepository } from '../../domain/services/repositories/event-repository';
import { UserRepository } from '../../domain/services/repositories/user-repository';
import { VerificationCodeRepository } from '../../domain/services/repositories/verification-code-repository ';
import { MongoEventRepository } from '../database/mongo/repositories/mongo-event-repository';
import { MongoUserRepository } from '../database/mongo/repositories/mongo-user-repository';
import { MongoVerificationCodeRepository } from '../database/mongo/repositories/mongo-verification-code-repository';
import { MysqlEventRepository } from '../database/mysql/repositories/mysql-event-repository';
import { MysqlUserRepository } from '../database/mysql/repositories/mysql-user-repository';
import { MysqlVerificationCodeRepository } from '../database/mysql/repositories/mysql-validation-code-repository';

export class RepositoryServiceProvider implements ServiceProvider {
    public async register(): Promise<void> {
        if (Environment.APP_PREFERRED_DATABASE === 'mysql') {
            container.register<EventRepository>("EventRepository", { useClass: MysqlEventRepository });
            container.register<VerificationCodeRepository>("VerificationCodeRepository", { useClass: MysqlVerificationCodeRepository });
            container.register<UserRepository>("UserRepository", { useClass: MysqlUserRepository });
        } else if (Environment.APP_PREFERRED_DATABASE === 'mongodb') {
            container.register<EventRepository>("EventRepository", { useClass: MongoEventRepository });
            container.register<VerificationCodeRepository>("VerificationCodeRepository", { useClass: MongoVerificationCodeRepository });
            container.register<UserRepository>("UserRepository", { useClass: MongoUserRepository });
        }
    }
}
