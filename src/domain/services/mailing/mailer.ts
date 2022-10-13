import { Mailable } from "./mailable";

export interface Mailer {
    send(mailable: Mailable, to: string): Promise<void>;
}