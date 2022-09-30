import axios, {
    AxiosRequestConfig,
    AxiosResponse,
    AxiosInstance, AxiosPromise,
} from 'axios';

import * as httpBuildQuery from 'http-build-query';
import * as crypto from 'crypto';
import * as sortKeys from 'sort-keys';

export interface ApiResponse extends AxiosResponse {
    data: {
        Data: object;
        Status: string;
    }
}

export class TmeApiClient {
    private client: AxiosInstance;

    constructor(private token: string,
                private secret: string,
                private baseUrl: string = 'https://api.tme.eu/',
                private defaultLanguage: string = 'EN',
                private defaultCountry: string = 'GB') {

        this.baseUrl = baseUrl.replace(/\/*$/, '') + '/';
        this.client = axios.create({baseURL: baseUrl});
        this.client.interceptors.request.use(this.signRequestInterceptor.bind(this));
    }

    private signRequestInterceptor(config: AxiosRequestConfig) {
        // some defaults
        config.data = Object.assign(
            {
                Language: this.defaultLanguage,
                Country: this.defaultCountry
            },
            config.data
        );

        const authData = {
            Token: this.token,
            ApiSignature: this.calcSig(config.url, {...config.data, Token: this.token})
        };

        config.data = {...config.data, ...authData};

        return config;
    }

    // @see http://locutus.io/php/url/rawurlencode/
    private rawurlencode(text: string): string {
        text = (text + '');

        return encodeURIComponent(text)
            .replace(/!/g, '%21')
            .replace(/'/g, '%27')
            .replace(/\(/g, '%28')
            .replace(/\)/g, '%29')
            .replace(/\*/g, '%2A')
            .replace(/%2B/g, '%2520')
    }

    private calcSig(url: string, data: object) {
        url = this.baseUrl + url;
        data = sortKeys(data, {deep: true});

        const qs = httpBuildQuery(data);
        const sigBase = 'POST&' + this.rawurlencode(url) + '&' + this.rawurlencode(qs);

        return crypto.createHmac('sha1', this.secret).update(sigBase, 'utf8').digest('base64');
    }

    public request(resource: string, data: object, format: string = 'json'): AxiosPromise<ApiResponse> {
        return this.client.post<ApiResponse>(
            resource.replace(/^\/+/g, '') + '.' + format,
            data
        );
    }
}

