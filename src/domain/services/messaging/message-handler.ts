export interface MessageHandler {
    handle(message: object): Promise<void>;
}
