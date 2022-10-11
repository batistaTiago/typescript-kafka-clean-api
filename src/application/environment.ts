export default abstract class Environment {
    public static readonly APP_NAME = 'app';

    public static readonly MONGO_CONNECTION_URI = 'mongodb://localhost:27017/app';
    
    public static readonly REDIS_HOST = 'localhost';
    public static readonly REDIS_PORT = 6379;
    public static readonly REDIS_PASSWORD = '';

    public static readonly KAFKA_BROKERS = ['localhost:9092'];
    public static readonly KAFKA_CONSUMER_GROUP_ID = 'app-consumer-group';
    public static readonly KAFKA_CONSUMER_MIN_BYTER = 5;
    public static readonly KAFKA_CONSUMER_MAX_BYTER = 1e6;
    public static readonly KAFKA_CONSUMER_MAX_WAIT_TIME_MS = 1000;
}