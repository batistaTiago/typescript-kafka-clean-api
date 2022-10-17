import { createTransport } from 'nodemailer';
import { container } from 'tsyringe';
import { Environment } from '../../config/environment';
import { ServiceProvider } from '../../domain/services/provider';

export class MailerServiceProvider implements ServiceProvider {
    public register(): void {
        const transportParams = {
            host: Environment.MAIL_SERVER,
            port: Environment.MAIL_PORT,
            secure: true,
            auth: {
                user: Environment.MAIL_USERNAME,
                pass: Environment.MAIL_PASSWORD
            },
            tls: { rejectUnauthorized: true }
        };

        container.registerInstance("NodeMailerTransport", createTransport(transportParams));
    }
}