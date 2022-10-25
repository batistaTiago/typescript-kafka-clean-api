import * as axios from 'axios';
import { AxiosHttpClientAdapter } from "./axios-http-client-adapter";

const baseRequestParams = {
    method: 'get',
    url: 'test url',
};

const defaultHeaders = { 'content-type': 'application/json' };

describe("AxiosHttpClientAdapter", () => {
    it('should forward call into axios library', async () => {
        const fakeAxios = { request: jest.fn().mockResolvedValueOnce({ status: 200, data: {} }) } as unknown as axios.Axios;
        const sut = new AxiosHttpClientAdapter(fakeAxios);

        const fakeAxiosRequestSpy = jest.spyOn(fakeAxios, 'request');

        await sut.request(baseRequestParams)
        expect(fakeAxiosRequestSpy).toHaveBeenCalledWith({ headers: defaultHeaders, ...baseRequestParams });
    });

    it('should extract data from response object and return it as an HttpResponse', async () => {
        const expectedResult = { statusCode: 200, body: { arbitrary: 'fields' } };

        const fakeAxios = { request: jest.fn().mockResolvedValue({ status: 200, data: { arbitrary: 'fields' } }) } as unknown as axios.Axios;
        const sut = new AxiosHttpClientAdapter(fakeAxios);

        const result = await sut.request(baseRequestParams);

        expect(result).toEqual(expectedResult);
    });

    it('should throw if client library throws', () => {
        const fakeAxios = { request: jest.fn().mockImplementationOnce(() => { throw new Error('Hypothetical axios error'); }) } as unknown as axios.Axios;
        const sut = new AxiosHttpClientAdapter(fakeAxios);

        const requestPromise = sut.request(baseRequestParams);

        expect(requestPromise).rejects.toThrow(new Error('Hypothetical axios error'));
    });

    it('should stringify the data if there are any', async () => {
        const fakeAxios = { request: jest.fn().mockResolvedValue({ status: 200, data: { arbitrary: 'fields' } }) } as unknown as axios.Axios;
        const sut = new AxiosHttpClientAdapter(fakeAxios);
        const sampleData = { some: 'data' };

        const fakeAxiosRequestSpy = jest.spyOn(fakeAxios, 'request');

        await sut.request({ ...baseRequestParams, body: sampleData });

        expect(fakeAxiosRequestSpy).toHaveBeenCalledWith({
            method: 'get',
            url: 'test url',
            data: JSON.stringify(sampleData),
            headers: defaultHeaders
        });
    });
});