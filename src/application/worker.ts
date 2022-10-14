import 'reflect-metadata';
import { WorkerApplication } from './worker-application';

const TOPIC_NAME = process.argv.slice(2)[0] ?? 'events';

new WorkerApplication(TOPIC_NAME).start().then(() => {
    console.log('Worker running...');
});
