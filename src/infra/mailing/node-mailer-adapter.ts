import { Mailable } from "../../domain/services/mailing/mailable";
import { Mailer } from "../../domain/services/mailing/mailer";
import * as NodeMailer from 'nodemailer';
import Environment from "../../application/environment";

export class NodeMailerAdapter implements Mailer {
    private readonly transporter: NodeMailer.Transporter;

    public constructor() {
        this.transporter = NodeMailer.createTransport({
            host: Environment.MAIL_SERVER,
            port: Environment.MAIL_PORT,
            // secure: false,
            auth: {
                user: Environment.MAIL_USERNAME,
                pass: Environment.MAIL_PASSWORD
            },
            // tls: { rejectUnauthorized: false }
        });
    }

    public async send(mailable: Mailable, to: string): Promise<void> {
        return this.transporter.sendMail({
            from: Environment.MAIL_FROM,
            to: to,
            subject: mailable.subject,
            html: mailable.message
        })
    }
}