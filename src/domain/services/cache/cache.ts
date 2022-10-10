export interface Cache {
    has(key: string): Promise<boolean>;
    get(key: string): Promise<string|object|null>;
    set(key: string, data: string|object): Promise<void>;
    forget(key: string): Promise<void>;
}