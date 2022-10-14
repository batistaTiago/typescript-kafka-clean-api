import { inject, injectable } from "tsyringe";
import { Event as EventEntitiy } from "../../entities/event";
import { MessageProducer } from "../../services/messaging/message-producer";

@injectable()
export class HomeAccessUseCase {
    private topicName: string = 'events';

    public constructor(@inject('MessageProducer') private messageProducer: MessageProducer) { }

    public async execute(data: object): Promise<object> {
        const requestDateTime = new Date();
        const event: EventEntitiy = {
            eventName: 'NEW_HOMEPAGE_ACCESS',
            happenedAt: requestDateTime,
            data
        };
        console.log(`New home page access detected at ${requestDateTime}, publishing event!!!`);

        const outputDate = requestDateTime.toLocaleString("pt-br", {
            timeZone: "America/Sao_Paulo",
        });

        await this.messageProducer.publish(this.topicName, event);

        return {
            status: 'ok',
            requestDateTime: outputDate
        };
    }
}