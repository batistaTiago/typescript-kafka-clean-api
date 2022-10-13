import { Mailable } from "../../domain/services/mailing/mailable";
import { Mailer } from "../../domain/services/mailing/mailer";
import * as NodeMailer from 'nodemailer';
import Environment from "../../application/environment";
import { inject, injectable } from "tsyringe";

@injectable()
export class NodeMailerAdapter implements Mailer {
    public constructor(@inject('NodeMailerTransport') private readonly transporter: NodeMailer.Transporter) { }

    public async send(mailable: Mailable, to: string): Promise<void> {
        return this.transporter.sendMail({
            from: Environment.MAIL_FROM,
            to: to,
            subject: mailable.subject,
            html: mailable.message
        })
    }
}