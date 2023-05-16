import {
	type AxiosRequestConfig,
	type AxiosResponse,
	type InternalAxiosRequestConfig
} from 'axios';

// 定义一个常见后端请求返回
interface BaseApiResponse<T> {
	code: number;
	message: string;
	data: T;
}

// 自定义请求配置
interface RequestOptions {
	// 是否全局展示请求 错误信息
	globalErrorMessage?: boolean;
	// 是否全局展示请求 成功信息
	globalSuccessMessage?: boolean;
}

// 拓展自定义请求配置
interface ExpandAxiosRequestConfig<D = any> extends AxiosRequestConfig<D> {
	interceptorHooks?: InterceptorHooks;
	requestOptions?: RequestOptions;
}

// 拓展 axios 请求配置
interface ExpandInternalAxiosRequestConfig<D = any>
	extends InternalAxiosRequestConfig<D> {
	interceptorHooks?: InterceptorHooks;
	requestOptions?: RequestOptions;
}

// 拓展 axios 返回配置
interface ExpandAxiosResponse<T = any, D = any> extends AxiosResponse<T, D> {
	config: ExpandInternalAxiosRequestConfig<D>;
}

interface InterceptorHooks {
	requestInterceptor?: (
		config: InternalAxiosRequestConfig
	) => InternalAxiosRequestConfig;
	requestInterceptorCatch?: (error: any) => any;
	responseInterceptor?: (
		response: AxiosResponse
	) => AxiosResponse | Promise<AxiosResponse>;
	responseInterceptorCatch?: (error: any) => any;
}
