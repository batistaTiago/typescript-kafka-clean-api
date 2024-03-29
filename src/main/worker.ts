import 'reflect-metadata';
import { WorkerApplication } from '../application/worker-application';

const TOPIC_NAME = process.argv.slice(2)[0] ?? 'events';

new WorkerApplication(TOPIC_NAME).start().then(() => {
    console.log(`Worker running on topic ${TOPIC_NAME}`);
});
