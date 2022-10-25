import 'reflect-metadata';
import { container } from 'tsyringe';
import { HttpClient } from '../domain/services/http/http-client';
import * as Providers from '../infra/providers';

Providers.registerAll();

const httpClient: HttpClient = container.resolve('HttpClient');

console.log(httpClient.constructor.name);

// httpClient.request({ url: 'http://viacep.com.br/ws/01001000/json/'})
//     .then(console.log);
