import { Message } from "./message";

export interface MessageHandler {
    handle(message: Message<object>): Promise<void>;
}
