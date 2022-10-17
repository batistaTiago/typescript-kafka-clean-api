// import 'reflect-metadata';
// import { container } from 'tsyringe';
// import { EventRepository } from '../domain/services/repositories/event-repository';
// import { Event } from "../infra/database/mysql/entities/event.entity";
// import * as Providers from '../infra/providers';


// (async () => {
//     Providers.registerAll();

//     const repository: EventRepository = container.resolve('EventRepository');

//     await repository.storeEvent({
//         eventName: 'Sandbox',
//         happenedAt: new Date()
//     });
// })();