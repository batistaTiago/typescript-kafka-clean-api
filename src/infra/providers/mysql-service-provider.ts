import { container } from 'tsyringe';
import { DataSource } from 'typeorm';
import { Environment } from '../../config/environment';
import { ServiceProvider } from '../../domain/services/provider';

export class MysqlServiceProvider implements ServiceProvider {
    public register(): void {
        const typeOrmDataSource = new DataSource({
            type: "mysql",
            host: Environment.MYSQL_HOST,
            port: Environment.MYSQL_PORT,
            username: Environment.MYSQL_USER,
            password: Environment.MYSQL_PASSWORD,
            database: Environment.MYSQL_DB_NAME,
            entities: this.entitiesDirectory(),
            logging: Environment.APP_DEBUG,
            synchronize: true,
        });

        container.registerInstance(DataSource, typeOrmDataSource);
    }

    private entitiesDirectory(): string[] {
        return [
            __dirname + '/../**/*.entity.ts', 
            __dirname + '/../**/*.entity.js'
        ];
    }
}