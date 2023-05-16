import axios, {
	type CustomParamsSerializer,
	type AxiosInstance,
	type AxiosResponse
} from 'axios';
import { stringify } from 'qs';
import {
	type BaseApiResponse,
	type ExpandAxiosRequestConfig,
	type ExpandAxiosResponse,
	type InterceptorHooks
} from '/@/utils/http/types';
import { getToken } from '/@/utils/auth';

// 导出Request类，可以用来自定义传递配置来创建实例
class Request {
	// axios 实例
	private readonly _instance: AxiosInstance;
	// 默认配置
	private readonly _defaultConfig: ExpandAxiosRequestConfig = {
		baseURL: '/api',
		timeout: 10000,
		timeoutErrorMessage: '服务器繁忙，请求超时！',
		headers: {
			Accept: 'application/json, text/plain, */*',
			'Content-Type': 'multipart/form-data',
			'X-Requested-With': 'XMLHttpRequest'
		},
		// 数组格式参数序列化（https://github.com/axios/axios/issues/5142)
		paramsSerializer: {
			serialize: stringify as unknown as CustomParamsSerializer
		},
		requestOptions: {
			globalErrorMessage: true,
			globalSuccessMessage: false
		}
	};

	private readonly _interceptorHooks?: InterceptorHooks;

	constructor(config: ExpandAxiosRequestConfig) {
		// 使用axios.create创建axios实例
		this._instance = axios.create(Object.assign(this._defaultConfig, config));
		this._interceptorHooks = config.interceptorHooks;
		this.setupInterceptors();
	}

	// 通用拦截，在初始化时就进行注册和运行，对基础属性进行处理
	private setupInterceptors() {
		this._instance.interceptors.request.use(
			this._interceptorHooks?.requestInterceptor,
			this._interceptorHooks?.requestInterceptorCatch
		);
		this._instance.interceptors.response.use(
			this._interceptorHooks?.responseInterceptor,
			this._interceptorHooks?.responseInterceptorCatch
		);
	}

	// 定义核心请求
	public async request(
		config: ExpandAxiosRequestConfig
	): Promise<AxiosResponse> {
		// ！！！⚠️ 注意：axios 已经将请求使用 promise 封装过了
		// 这里直接返回，不需要我们再使用 promise 封装一层
		return await this._instance.request(config);
	}

	/**
	 * 通用请求工具函数
	 *
	 * 1. GET请求
	 *  params传参
	 * request.get('/xxx', params });
	 *  url拼接传参
	 * request.get('/xxx?message=' + msg);
	 *
	 * 2. POST请求
	 *  params传参
	 * request.post('post', '/xxx', { params: param });
	 *  data传参
	 * request.post('post', '/xxx', { data: data });
	 *
	 */
	public async get<T = any>(
		url: string,
		params?: T,
		config?: ExpandAxiosRequestConfig
	): Promise<AxiosResponse<BaseApiResponse<T>>> {
		if (params != undefined) {
			url += '?' + stringify(params, { arrayFormat: 'brackets' });
		}
		return await this._instance.get(url, config);
	}

	public async post<T = any>(
		url: string,
		params?: T,
		data?: any,
		config?: ExpandAxiosRequestConfig
	): Promise<T> {
		if (params != undefined) {
			url += '?' + stringify(params, { arrayFormat: 'brackets' });
		}
		return await this._instance.post(url, data, config);
	}

	public async put<T = any>(
		url: string,
		params?: T,
		data?: any,
		config?: ExpandAxiosRequestConfig
	): Promise<T> {
		if (params != undefined) {
			url += '?' + stringify(params, { arrayFormat: 'brackets' });
		}
		return await this._instance.put(url, data, config);
	}

	public async delete<T = any>(
		url: string,
		params?: T,
		config?: ExpandAxiosRequestConfig
	): Promise<T> {
		if (params != undefined) {
			url += '?' + stringify(params, { arrayFormat: 'brackets' });
		}
		return await this._instance.delete(url, config);
	}
}

const MyInterceptorHooks: InterceptorHooks = {
	// 请求拦截器
	requestInterceptor(config) {
		// 请求头部处理，如添加 token
		const token = getToken();
		if (token != null && token.trim.length > 0) {
			config.headers.Authorization = token;
		}
		return config;
	},
	// 请求错误捕获器
	async requestInterceptorCatch(err) {
		// 请求错误，这里可以用全局提示框进行提示
		return await Promise.reject(err);
	},
	// 响应拦截器
	responseInterceptor(result) {
		// 因为 axios 返回不支持扩展自定义配置，需要自己断言一下
		const res = result as ExpandAxiosResponse;
		// 与后端约定的请求成功码
		const SUCCESS_CODE = 200;
		if (res.status !== 200) {
			return Promise.reject(res);
		}
		if (res.data.code !== SUCCESS_CODE) {
			if (res.config.requestOptions?.globalErrorMessage) {
				// 这里全局提示错误
				console.error(res.data.message);
			}
			return Promise.reject(res.data);
		}
		if (res.config.requestOptions?.globalSuccessMessage) {
			// 这里全局提示请求成功
			console.log(res.data.message);
		}
		// 请求返回值，建议将 返回值 进行解构
		return res.data.result;
	},
	async responseInterceptorCatch(err) {
		// 这里用来处理 http 常见错误，进行全局提示
		const mapErrorStatus = new Map([
			[400, '请求方式错误'],
			[401, '请重新登录'],
			[403, '拒绝访问'],
			[404, '请求地址有误'],
			[500, '服务器出错']
		]);
		const message =
			mapErrorStatus.get(err.response.status) ?? '请求出错，请稍后再试';
		// 此处全局报错
		console.error(message);
		return await Promise.reject(err.response);
	}
};

const request = new Request({
	baseURL: '/api',
	interceptorHooks: MyInterceptorHooks
});

export default request;
