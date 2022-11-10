export interface UseCase {
    execute(data: object): Promise<object>;
}
