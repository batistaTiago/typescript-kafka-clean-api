import 'reflect-metadata';
import { ApiApplication } from '../application/api-application';

new ApiApplication().start().then(async() => {
    console.log('Server restart event published successfully!');
    console.log('Server running...');
});
