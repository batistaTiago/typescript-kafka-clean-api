export interface ServiceProvider {
    register(): Promise<void>;
}