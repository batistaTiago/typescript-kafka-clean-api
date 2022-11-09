import { KafkaServiceProvider } from "./kafka-service-provider";
import { ServiceProvider } from '../../domain/services/provider';
import { MongoServiceProvider } from "./mongo-service-provider";
import { AppServiceProvider } from "./app-service-provider";
import { RedisServiceProvider } from "./redis-service-provider";
import { MailerServiceProvider } from "./mailer-service-provider";
import { CryptographyServiceProvider } from "./cryptography-service-provider";
import { MysqlServiceProvider } from "./mysql-service-provider";
import { RepositoryServiceProvider } from "./repository-service-provider";
import { AxiosServiceProvider } from "./axios-service-provider";
import { ValidationServiceProvider } from "./validation-service-provider";
import { ConfigServiceProdvider } from "./config-service-provider";

export const registerAll = () => {
    // @@TODO: carregar dinamicamente...
    [
        new ConfigServiceProdvider(),
        new MysqlServiceProvider(),
        new MongoServiceProvider(),
        new RedisServiceProvider(),
        new KafkaServiceProvider(),
        new CryptographyServiceProvider(),
        new MailerServiceProvider(),
        new AxiosServiceProvider(),
        new AppServiceProvider(),
        new RepositoryServiceProvider(),
        new ValidationServiceProvider(),
    ].forEach(provider => provider.register());
}

