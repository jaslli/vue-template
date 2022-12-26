import { Method, AxiosError, AxiosResponse, AxiosRequestConfig } from "axios";

export type resultType = {
    accessToken?: string;
};

export type RequestMethods = Extract<
    Method,
    "GET" | "POST" | "PUT" | "DELETE" | "OPTION"
>;

export interface CloudHttpError extends AxiosError {
    isCancelRequest?: boolean;
}

export interface CloudHttpResoponse extends AxiosResponse {
    config: CloudHttpRequestConfig;
}

export interface CloudHttpRequestConfig extends AxiosRequestConfig {
    beforeRequestCallback?: (request: CloudHttpRequestConfig) => void;
    beforeResponseCallback?: (response: CloudHttpResoponse) => void;
}

export default class Http {
    request<T>(
        method: RequestMethods,
        url: string,
        param?: AxiosRequestConfig,
        axiosConfig?: CloudHttpRequestConfig
    ): Promise<T>;
    post<T, P>(url: string, params?: T, config?: CloudHttpRequestConfig): Promise<P>;
    get<T, P>(url: string, params?: T, config?: CloudHttpRequestConfig): Promise<P>;
}
