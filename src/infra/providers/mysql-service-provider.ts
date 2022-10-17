import { container } from 'tsyringe';
import { DataSource } from 'typeorm';
import { ServiceProvider } from '../../domain/services/provider';

export class MysqlServiceProvider implements ServiceProvider {
    public register(): void {
        const typeOrmDataSource = new DataSource({
            type: "mysql",
            host: "mysql",
            port: 3306,
            username: "user",
            password: "sqlP4SS",
            database: "db",
            entities: [__dirname + '/../**/*.entity.ts', __dirname + '/../**/*.entity.js'],
            logging: true,
            synchronize: true,
        });

        container.registerInstance('MysqlConnection', typeOrmDataSource);
    }
}