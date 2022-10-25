import { HttpResponse } from './http-response';

export interface HttpRequestOptions {
    url: string;
    method?: string;
    body?: object;
    headers?: object;
}

export interface HttpClient {
    request(options: HttpRequestOptions): Promise<HttpResponse>;
}