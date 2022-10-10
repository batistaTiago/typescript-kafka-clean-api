export interface Event {
    eventName: string;
    happened_at: Date;
    data?: object|Array<object>;
}