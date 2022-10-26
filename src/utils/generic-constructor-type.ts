declare type GenericConstructor<T> = {
    new (...args: any[]): T;
};
export default GenericConstructor;
