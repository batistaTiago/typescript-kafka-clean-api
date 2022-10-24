import { inject } from "tsyringe";
import { DataSource, EntityTarget, FindOneOptions, Repository } from "typeorm";

export abstract class MysqlBaseRepository {
    public constructor(@inject('MysqlConnection') protected readonly connection: DataSource) { }

    protected generateWhereClause(fields: Partial<object>): FindOneOptions<object> {
        return {
            where: {
                ...fields
            }
        };
    }

    protected getTypeOrmRepo(): Repository<object> {
        return this.connection.getRepository(this.entity());
    }

    protected abstract entity(): EntityTarget<object>;
}