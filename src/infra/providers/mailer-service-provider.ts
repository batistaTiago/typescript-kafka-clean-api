import { createTransport } from 'nodemailer';
import { container } from 'tsyringe';
import Environment from '../../application/environment';
import { ServiceProvider } from '../../domain/services/provider';

export class MailerServiceProvider implements ServiceProvider {
    public async register(): Promise<void> {
        const transportParams = {
            host: Environment.MAIL_SERVER,
            port: Environment.MAIL_PORT,
            // secure: false,
            auth: {
                user: Environment.MAIL_USERNAME,
                pass: Environment.MAIL_PASSWORD
            },
            // tls: { rejectUnauthorized: false }
        };

        container.registerInstance("NodeMailerTransport", createTransport(transportParams));
    }
}