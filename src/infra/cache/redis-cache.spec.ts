import { RedisClientType } from "@redis/client";
import { RedisCache } from "./redis-cache";

const createClientMock = () => {
    return {
        on: (event: string, handler: Function) => {},
        connect: () => {},
        disconnect: () => {},
        get: async (key: string): Promise<object|string> => {
            return null
        },
        set: (key: string, value: string) => {}
    };
};

let clientMock = createClientMock();

jest.mock('redis', () => ({
        createClient: () => clientMock
    })
);

describe('RedisClient', () => {
    beforeEach(() => {
        clientMock = createClientMock();
    });
    
    it('should setup events on instantiation', () => {
        const onSpy = jest.spyOn(clientMock, 'on');
        new RedisCache(clientMock as RedisClientType);
        expect(onSpy).toHaveBeenCalledTimes(2);
    });    
    
    it('should connect before accessing the database', async () => {
        const connectSpy = jest.spyOn(clientMock, 'connect');

        const sut = new RedisCache(clientMock as RedisClientType);
        await sut.has('some-key');

        expect(connectSpy).toHaveBeenCalled();
    });

    it('should forward has calls to the client library get method', async () => {
        const getSpy = jest.spyOn(clientMock, 'get');

        const sut = new RedisCache(clientMock as RedisClientType);
        await sut.has('some-key');

        expect(getSpy).toHaveBeenCalledTimes(1);
        expect(getSpy).toHaveBeenCalledWith('some-key');
    });

    it('should forward get calls to the client library', async () => {
        const getSpy = jest.spyOn(clientMock, 'get');

        const sut = new RedisCache(clientMock as RedisClientType);
        await sut.get('some-key');

        expect(getSpy).toHaveBeenCalledTimes(1);
        expect(getSpy).toHaveBeenCalledWith('some-key');
    });

    it('should handle null string as null', async () => {
        const getSpy = jest.spyOn(clientMock, 'get').mockReturnValueOnce(new Promise(resolve => resolve('null')));

        const sut = new RedisCache(clientMock as RedisClientType);
        const value = await sut.get('some-key');

        expect(getSpy).toHaveBeenCalledTimes(1);
        expect(getSpy).toHaveBeenCalledWith('some-key');
        expect(value).toBe(null);
    });

    it('should handle strings as strings, not json', async () => {
        const getSpy = jest.spyOn(clientMock, 'get').mockReturnValueOnce(new Promise(resolve => resolve('teste')));

        const sut = new RedisCache(clientMock as RedisClientType);
        const value = await sut.get('some-key');

        expect(getSpy).toHaveBeenCalledTimes(1);
        expect(getSpy).toHaveBeenCalledWith('some-key');
        expect(value).toBe('teste');
    });

    it('should forward set calls to the client library', async () => {
        const objectExample = {some_object_field: 'some-object-value'};
        const setSpy = jest.spyOn(clientMock, 'set');

        const sut = new RedisCache(clientMock as RedisClientType);
        await sut.set('some-key', 'some-value');
        await sut.set('some-object-key', objectExample);

        expect(setSpy).toHaveBeenCalledTimes(2);
        expect(setSpy).toHaveBeenNthCalledWith(1,'some-key', 'some-value');
        expect(setSpy).toHaveBeenNthCalledWith(2,'some-object-key', JSON.stringify(objectExample));
    });

    it('should forward forget calls to the client library set method', async () => {
        const setSpy = jest.spyOn(clientMock, 'set');

        const sut = new RedisCache(clientMock as RedisClientType);
        
        await sut.set('some-key', 'some-value');
        await sut.forget('some-key');

        expect(setSpy).toHaveBeenCalledTimes(2);
        expect(setSpy).toHaveBeenNthCalledWith(2, 'some-key', null);
    });    
});