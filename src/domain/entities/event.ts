export interface Event {
    eventName: string;
    happenedAt: Date;
    data?: object|object[];
}