import { KafkaServiceProvider } from "./kafka-service-provider";
import { ServiceProvider } from '../../domain/services/provider';
import { MongoServiceProvider } from "./mongo-service-provider";
import { AppServiceProvider } from "./app-service-provider";
import { RedisServiceProvider } from "./redis-service-provider";


// @@TODO: carregar dinamicamente...
const providers: ServiceProvider[] = [
    new MongoServiceProvider(),
    new RedisServiceProvider(),
    new KafkaServiceProvider(),
    new AppServiceProvider(),
];

export const registerAll = () => {
    providers.forEach((provider: ServiceProvider) => { 
        // console.log('######## registering service provider: ' + provider.constructor.name);
        provider.register()
    })
}

