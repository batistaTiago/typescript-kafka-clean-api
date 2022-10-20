import { KafkaServiceProvider } from "./kafka-service-provider";
import { ServiceProvider } from '../../domain/services/provider';
import { MongoServiceProvider } from "./mongo-service-provider";
import { AppServiceProvider } from "./app-service-provider";
import { RedisServiceProvider } from "./redis-service-provider";
import { MailerServiceProvider } from "./mailer-service-provider";
import { CryptographyServiceProvider } from "./cryptography-service-provider";
import { MysqlServiceProvider } from "./mysql-service-provider";
import { RouteServiceProvider } from "./route-service-provider";
import { RepositoryServiceProvider } from "./repository-service-provider";



export const registerAll = () => {
    console.log('#### Registering service providers');

    // @@TODO: carregar dinamicamente...
    const providers: ServiceProvider[] = [
        new CryptographyServiceProvider(),
        new MysqlServiceProvider(),
        new MongoServiceProvider(),
        new RedisServiceProvider(),
        new KafkaServiceProvider(),
        new MailerServiceProvider(),
        new AppServiceProvider(),
        new RepositoryServiceProvider(),
        new RouteServiceProvider(),
    ];

    providers.forEach((provider: ServiceProvider) => {
        // console.log('######## Registering service provider: ' + provider.constructor.name);
        provider.register();
    });
}

