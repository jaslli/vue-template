import Axios, { AxiosInstance, AxiosRequestConfig, CustomParamsSerializer } from "axios";
import { CloudHttpError, RequestMethods, CloudHttpResoponse, CloudHttpRequestConfig } from "./type";
import { getToken } from "/@/utils/auth";
import { stringify } from "qs";

// 请求实例
const defaultConfig: AxiosRequestConfig = {
    baseURL: "/api",
    timeout: 10000,
    timeoutErrorMessage: "服务器繁忙，请求超时！",
    headers: {
        Accept: "application/json, text/plain, */*",
        "Content-Type": "multipart/form-data",
        "X-Requested-With": "XMLHttpRequest"
    },
    // 数组格式参数序列化（https://github.com/axios/axios/issues/5142)
    paramsSerializer: {
        serialize: stringify as unknown as CustomParamsSerializer
    }
};

class Http {
    // 构造器
    constructor() {
        this.httpInterceptorsRequest();
        this.httpInterceptorsResponse();
    }
    // 初始化配置对象
    private static initConfig: CloudHttpRequestConfig = {};

    // 保存当前Axios实例对象
    private static axiosInstance: AxiosInstance = Axios.create(defaultConfig);

    // 请求拦截
    private httpInterceptorsRequest(): void {
        Http.axiosInstance.interceptors.request.use((config: CloudHttpRequestConfig) => {
                const $config = config;
                // 优先判断post/get等方法是否传入回调，否则执行初始化设置等回调
                if (typeof config.beforeRequestCallback === "function") {
                    config.beforeRequestCallback($config);
                    return $config;
                }
                if (Http.initConfig.beforeRequestCallback) {
                    Http.initConfig.beforeRequestCallback($config);
                    return $config;
                }
                const token = getToken();
                if (token) {
                    config.headers!["Authorization"] = "Bearer " + token;
                    return $config;
                } else {
                    return $config;
                }
            }, (error) => {
                return Promise.reject(error);
            }
        );
    }

    // 响应拦截
    private httpInterceptorsResponse(): void {
        const instance = Http.axiosInstance;
        instance.interceptors.response.use((response: CloudHttpResoponse) => {
                const $config = response.config;
                // 优先判断post/get等方法是否传入回调，否则执行初始化设置等回调
                if (typeof $config.beforeResponseCallback === "function") {
                    $config.beforeResponseCallback(response);
                    return response.data;
                }
                if (Http.initConfig.beforeResponseCallback) {
                    Http.initConfig.beforeResponseCallback(response);
                    return response.data;
                }
                return response.data;
            }, (error: CloudHttpError) => {
                const $error = error;
                $error.isCancelRequest = Axios.isCancel($error);
                // 所有的响应异常 区分来源为取消请求/非取消请求
                return Promise.reject($error);
            }
        );
    }

    /**
     * 通用请求工具函数
     *
     * 1. GET请求
     *  params传参
     * http.request('get', '/xxx', params });
     *  url拼接传参
     * http.request('get', '/xxx?message=' + msg);
     *
     * 2. POST请求
     *  params传参
     * http.request('post', '/xxx', { params: param });
     *  data传参
     * http.request('post', '/xxx', { data: param });
     *
     */
    public request<T>(
        method: RequestMethods,
        url: string,
        param?: AxiosRequestConfig,
        axiosConfig?: CloudHttpRequestConfig
    ): Promise<T> {
        const config = {
            method,
            url,
            ...param,
            ...axiosConfig
        } as CloudHttpRequestConfig;

        // 单独处理自定义请求/响应回调
        return new Promise((resolve, reject) => {
            Http.axiosInstance
                .request(config)
                .then((response: any) => {
                    resolve(response);
                })
                .catch((error) => {
                    reject(error);
                });
        });
    }

    // 单独抽离的get工具函数
    public get<T, P>(url: string, params?: T, config?: CloudHttpRequestConfig): Promise<P> {
        return this.request<P>("GET", url, { params }, config);
    }

    // 单独抽离的post工具函数
    public post<T, P>(
        url: string,
        params?: AxiosRequestConfig<T>,
        config?: CloudHttpRequestConfig
    ): Promise<P> {
        return this.request<P>("POST", url, params, config);
    }

    // 单独抽离的delete工具函数
    public delete<T, P>(url: string, params?: T, config?: CloudHttpRequestConfig): Promise<P> {
        return this.request<P>("PUT", url, { params }, config);
    }

    // 单独抽离的put工具函数
    public put<T, P>(
        url: string,
        params?: AxiosRequestConfig<T>,
        config?: CloudHttpRequestConfig
    ): Promise<P> {
        return this.request<P>("DELETE", url, params, config);
    }

}

export const http = new Http();