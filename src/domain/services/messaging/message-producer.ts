export interface MessageProducer {
    publish (topicName: string, data: object): Promise<void>
}