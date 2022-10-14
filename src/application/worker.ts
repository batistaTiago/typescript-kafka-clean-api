import 'reflect-metadata';
import { WorkerApplication } from './worker-application';

// @@TODO: topic name deve vir por parametro do script.
const TOPIC_NAME = 'events';

new WorkerApplication(TOPIC_NAME).start().then(() => {
    console.log('Worker running...');
});
