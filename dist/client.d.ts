import { AxiosResponse, AxiosPromise } from 'axios';
export interface ApiResponse extends AxiosResponse {
    data: {
        Data: object;
        Status: string;
    };
}
export declare class TmeApiClient {
    private token;
    private secret;
    private baseUrl;
    private defaultLanguage;
    private defaultCountry;
    private client;
    constructor(token: string, secret: string, baseUrl?: string, defaultLanguage?: string, defaultCountry?: string);
    private signRequestInterceptor(config);
    private rawurlencode(text);
    private calcSig(url, data);
    request(resource: string, data: object, format?: string): AxiosPromise<ApiResponse>;
}
