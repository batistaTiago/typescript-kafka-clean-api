import { KafkaServiceProvider } from "./kafka-service-provider";
import { ServiceProvider } from '../../domain/services/provider';
import { MongoServiceProvider } from "./mongo-service-provider";
import { AppServiceProvider } from "./app-service-provider";
import { RedisServiceProvider } from "./redis-service-provider";
import { MailerServiceProvider } from "./mailer-service-provider";
import { CryptographyServiceProvider } from "./cryptography-service-provider";
import { MysqlServiceProvider } from "./mysql-service-provider";


// @@TODO: carregar dinamicamente...
const providers: ServiceProvider[] = [
    new CryptographyServiceProvider(),
    new MysqlServiceProvider(),
    new MongoServiceProvider(),
    new RedisServiceProvider(),
    new KafkaServiceProvider(),
    new MailerServiceProvider(),
    new AppServiceProvider(),
];

export const registerAll = () => {
    providers.forEach((provider: ServiceProvider) => { 
        console.log('######## Registering service provider: ' + provider.constructor.name);
        provider.register()
    })
}

