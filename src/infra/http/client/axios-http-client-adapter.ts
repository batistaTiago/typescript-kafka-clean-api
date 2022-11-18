import { Axios, AxiosRequestConfig } from 'axios';
import { injectable } from "tsyringe";
import { HttpClient, HttpRequestOptions } from '../../../domain/services/http/http-client';
import { HttpResponse } from '../../../domain/services/http/http-response';


// @@TODO: Fazer um outro componente decorando este, logando o resultado em um algum tipo de output interface (bd, arquivo, topico, ...)
@injectable()
export class AxiosHttpClientAdapter implements HttpClient {
    public constructor(private readonly axios: Axios) { }

    public async request(options: HttpRequestOptions): Promise<HttpResponse> {
        const response = await this.axios.request(this.buildAxiosRequestOptions(options));
        return { statusCode: response.status, body: response.data };
    }

    private buildAxiosRequestOptions({ method, url, body, headers }: HttpRequestOptions): AxiosRequestConfig<any> {
        const axiosOptions = new Map<string, string | object>();
        const defaultHeaders = { "content-type": "application/json" };

        axiosOptions.set('method', method);
        axiosOptions.set('url', url);
        axiosOptions.set('headers', headers ? { ...defaultHeaders, ...headers } : { ...defaultHeaders });
        
        if (body) {
            axiosOptions.set('data', JSON.stringify(body));
        }

        return Object.fromEntries(axiosOptions.entries());
    }
}
