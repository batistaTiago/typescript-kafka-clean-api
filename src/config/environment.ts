require('dotenv').config(); // @@TODOver uma forma de funcionar sem precisar estar aqui

export const Environment = {
    APP_NAME: process.env.APP_NAME,
    APP_SALT_ROUNDS: Number(process.env.APP_SALT_ROUNDS ?? '12'),
    APP_PREFERRED_DATABASE: process.env.APP_PREFERRED_DATABASE ?? 'mongodb',
    APP_DEBUG: process.env.APP_DEBUG === 'true' ? true : false,
    APP_SECRET_KEY: process.env.APP_SECRET_KEY,
    APP_AUTH_TOKEN_DURATION_DAYS: Number(process.env.APP_AUTH_TOKEN_DURATION_DAYS),

    API_PORT: process.env.API_PORT,

    MYSQL_HOST: process.env.MYSQL_HOST,
    MYSQL_PORT: Number(process.env.MYSQL_PORT),
    MYSQL_USER: process.env.MYSQL_USER,
    MYSQL_PASSWORD: process.env.MYSQL_PASSWORD,
    MYSQL_DB_NAME: process.env.MYSQL_DB_NAME,

    MONGO_CONNECTION_URI: process.env.MONGO_URL ?? process.env.MONGO_CONNECTION_URI,
    
    REDIS_HOST: process.env.REDIS_HOST,
    REDIS_PORT: Number(process.env.REDIS_PORT),
    REDIS_PASSWORD: process.env.REDIS_PASSWORD,

    KAFKA_BROKERS: process.env.KAFKA_BROKERS ?? '',
    KAFKA_CONSUMER_BASE_GROUP_ID: process.env.KAFKA_CONSUMER_BASE_GROUP_ID,
    KAFKA_CONSUMER_GROUP_ID: process.env.KAFKA_CONSUMER_GROUP_ID,
    KAFKA_CONSUMER_MIN_BYTES: Number(process.env.KAFKA_CONSUMER_MIN_BYTES ?? '5'),
    KAFKA_CONSUMER_MAX_BYTES: Number(process.env.KAFKA_CONSUMER_MAX_BYTES ?? '1e6'),
    KAFKA_CONSUMER_MAX_WAIT_TIME_MS: Number(process.env.KAFKA_CONSUMER_MAX_WAIT_TIME_MS ?? '1000'),

    MAIL_FROM: process.env.MAIL_FROM,
    MAIL_SERVER: process.env.MAIL_SERVER,
    MAIL_PORT: Number(process.env.MAIL_PORT),
    MAIL_USERNAME: process.env.MAIL_USERNAME,
    MAIL_PASSWORD: process.env.MAIL_PASSWORD,
}