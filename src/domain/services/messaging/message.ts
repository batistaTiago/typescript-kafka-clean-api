export interface Message<T extends object> {
    headers?: any;
    body: T;
}