import { WithId } from "../../dto/with-id";

export interface Repository<T> {
    insertOne(data: T): Promise<T & WithId>;
    findOne<T>(filters: object, options?: object): Promise<T>;
    updateOne<T>(filters: object, fields: object): Promise<T>;
}