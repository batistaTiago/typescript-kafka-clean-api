import 'reflect-metadata';
import { container } from 'tsyringe';
import { Event } from '../domain/entities/event';
import { Events } from '../domain/enums/events';
import { Encrypter } from '../domain/services/cryptography/encrypter';
import * as Providers from '../infra/providers';

Providers.registerAll();

const encrypter: Encrypter = container.resolve('Encrypter');
const event: Event = {
    eventName: Events.NEW_SANDBOX_EXECUTION,
    happenedAt: new Date(),
    data: {
        some: 'data'
    }
}

const jwtString = encrypter.encrypt(event);
const decrypted = encrypter.decrypt(jwtString);
