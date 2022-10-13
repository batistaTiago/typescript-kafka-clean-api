import { container } from 'tsyringe';
import Environment from '../../application/environment';
import { ServiceProvider } from '../../domain/services/provider';

export class MailerServiceProvider implements ServiceProvider {
    public async register(): Promise<void> { }
}