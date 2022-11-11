import { KafkaServiceProvider } from "./kafka-service-provider";
import { MongoServiceProvider } from "./mongo-service-provider";
import { AppServiceProvider } from "./app-service-provider";
import { RedisServiceProvider } from "./redis-service-provider";
import { MailerServiceProvider } from "./mailer-service-provider";
import { CryptographyServiceProvider } from "./cryptography-service-provider";
import { MysqlServiceProvider } from "./mysql-service-provider";
import { RepositoryServiceProvider } from "./repository-service-provider";
import { AxiosServiceProvider } from "./axios-service-provider";
import { ConfigServiceProdvider } from "./config-service-provider";
import { SignUpValidatorServiceProvider } from "./auth/signup-validator-service-provider";
import { AuthServiceProvider } from "./auth/auth-service-provider";

export const registerAll = () => {
    // @@TODO: carregar dinamicamente...
    [
        new ConfigServiceProdvider(),
        new AuthServiceProvider(),
        new MysqlServiceProvider(),
        new MongoServiceProvider(),
        new RedisServiceProvider(),
        new KafkaServiceProvider(),
        new CryptographyServiceProvider(),
        new MailerServiceProvider(),
        new AxiosServiceProvider(),
        new RepositoryServiceProvider(),
        new AppServiceProvider(),
    ].forEach(provider => provider.register());
}

