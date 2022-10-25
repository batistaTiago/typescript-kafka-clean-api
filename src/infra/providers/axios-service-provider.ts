import { container } from 'tsyringe';
import { ServiceProvider } from '../../domain/services/provider';
import axios, { Axios } from 'axios';

export class AxiosServiceProvider implements ServiceProvider {
    public register(): void {
        container.registerInstance(Axios, axios);
    }
}