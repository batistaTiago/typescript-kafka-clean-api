import { Kafka as KafkaJS, Producer as KafkaJSProducer, Consumer as KafkaJSConsumer, logLevel as KafkaJSLogLevel } from "kafkajs";
import { injectable } from "tsyringe";
import Environment from "../../../application/environment";

@injectable()
export class KafkaBroker {
    private kafka: KafkaJS;

    public constructor(kafka: KafkaJS) {
        this.kafka = kafka;
    }

    public makeProducer(): KafkaJSProducer {
        return this.kafka.producer();
    }

    public makeConsumer(): KafkaJSConsumer {
        return this.kafka.consumer({
            groupId: Environment.KAFKA_CONSUMER_GROUP_ID,
            minBytes: Environment.KAFKA_CONSUMER_MIN_BYTER,
            maxBytes: Environment.KAFKA_CONSUMER_MAX_BYTER,
            maxWaitTimeInMs: Environment.KAFKA_CONSUMER_MAX_WAIT_TIME_MS,
        });
    }
}