export interface EventRepository {
    storeEvent(data: object): Promise<any>;
}