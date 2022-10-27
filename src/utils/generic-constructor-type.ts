export type GenericConstructor<T> = {
    new (...args: Array<any>): T;
};
