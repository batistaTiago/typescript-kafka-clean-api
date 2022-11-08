import { Request } from 'express';
import { MongoClient } from 'mongodb';
import { inject, injectable } from 'tsyringe';
import { DataSource } from 'typeorm';
import { HttpResponse } from '../../../../domain/services/http/http-response';
import { ExpressControllerAdapter } from '../express-controller-adapter';
import { Producer as KafkaJSProducer } from 'kafkajs';
import { RedisClientType as RedisClient } from 'redis';
import { HttpStatus } from '../../../../domain/services/http/status';

interface ServiceStatus {
    status: boolean
};

@injectable()
export class HealthCheckControllerExpressAdapter extends ExpressControllerAdapter {
    public constructor(
        @inject('KafkaJSProducer') private readonly kafka: KafkaJSProducer,
        @inject(DataSource) private readonly mysql: DataSource,
        @inject(MongoClient) private readonly mongo: MongoClient,
        @inject('RedisClient') private readonly redis: RedisClient,
    ) {
        super();
    }

    public async handleExpressRequest(req: Request): Promise<HttpResponse> {
        const kafka = await this.kafkaStatus();
        const mysql = await this.mysqlStatus();
        const mongo = await this.mongoStatus();
        const redis = await this.redisStatus();

        return {
            statusCode: HttpStatus.OK,
            body: { services: { kafka, mysql, mongo, redis } }
        }
    }

    private async kafkaStatus(): Promise<ServiceStatus> {
        try {
            await this.kafka.connect();
            await this.kafka.disconnect();
            return { status: true };
        } catch (err: unknown) {
            return { status: false };
        }
    }

    private async mysqlStatus(): Promise<ServiceStatus> {
        try {
            await this.mysql.initialize();
            await this.mysql.destroy();
            return { status: true };
        } catch (err: unknown) {
            return { status: false };
        }
    }

    private async mongoStatus(): Promise<ServiceStatus> {
        try {
            await this.mongo.connect();
            return { status: true };
        } catch (err: unknown) {
            return { status: false };
        }
    }
    
    private async redisStatus(): Promise<ServiceStatus> {
        try {
            await this.redis.connect();
            await this.redis.disconnect();
            return { status: true };
        } catch (err: unknown) {
            return { status: false };
        }
    }
}