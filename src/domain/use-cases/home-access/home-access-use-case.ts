import { inject, injectable } from "tsyringe";
import { Event as EventEntitiy } from "../../entities/event";
import { Message } from "../../services/messaging/message";
import { MessageProducer } from "../../services/messaging/message-producer";
import { UseCase } from "../use-case";

@injectable()
export class HomeAccessUseCase implements UseCase {
    private topicName: string = 'events';

    public constructor(@inject('MessageProducer') private messageProducer: MessageProducer) { }

    // @@TODO: trocar o data por um EventDTO
    public async execute(data: object): Promise<object> {
        const requestDateTime = new Date();
        const message: Message<EventEntitiy> = { 
            body: {
                eventName: 'NEW_HOMEPAGE_ACCESS',
                happenedAt: requestDateTime,
                data
            }
        };

        console.log(`New home page access detected at ${requestDateTime}, publishing event!!!`);

        const outputDate = requestDateTime.toLocaleString("pt-br", {
            timeZone: "America/Sao_Paulo",
        });

        await this.messageProducer.publish(this.topicName, message);

        return {
            status: 'ok',
            requestDateTime: outputDate
        };
    }
}