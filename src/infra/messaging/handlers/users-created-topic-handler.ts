import { inject, injectable } from "tsyringe";
import { User } from "../../../domain/entities/user";
import { Mailable } from "../../../domain/services/mailing/mailable";
import { Mailer } from "../../../domain/services/mailing/mailer";
import { Message } from "../../../domain/services/messaging/message";
import { MessageHandler } from "../../../domain/services/messaging/message-handler";

@injectable()
export class UsersCreatedTopicHandler implements MessageHandler {
    public constructor(@inject('Mailer') private readonly mailer: Mailer) { }

    public async handle(message: Message<User>): Promise<void> {
        const mailable: Mailable = {
            subject: 'Welcome to the Typescript Kafka Clean Api!',
            message: 'example message',
        };

        await this.mailer.send(mailable, message.body.email);
    }
}
