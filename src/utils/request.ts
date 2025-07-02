// HTTP 请求工具类
import { getBaseURL, REQUEST_TIMEOUT, RETRY_COUNT } from '@/config/api';

// 请求响应接口
interface ApiResponse<T = any> {
  code: number;
  message: string;
  data: T;
  success: boolean;
}

// 请求配置接口
interface RequestConfig {
  url: string;
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  data?: any;
  header?: Record<string, string>;
  timeout?: number;
  retry?: number;
  showLoading?: boolean;
  loadingText?: string;
}

// 请求拦截器类型
type RequestInterceptor = (config: RequestConfig) => RequestConfig | Promise<RequestConfig>;
type ResponseInterceptor = (response: any) => any | Promise<any>;
type ErrorInterceptor = (error: any) => any | Promise<any>;

class HttpRequest {
  private baseURL: string;
  private defaultTimeout: number;
  private defaultRetry: number;
  private requestInterceptors: RequestInterceptor[] = [];
  private responseInterceptors: ResponseInterceptor[] = [];
  private errorInterceptors: ErrorInterceptor[] = [];

  constructor() {
    this.baseURL = getBaseURL();
    this.defaultTimeout = REQUEST_TIMEOUT;
    this.defaultRetry = RETRY_COUNT;
  }

  // 添加请求拦截器
  addRequestInterceptor(interceptor: RequestInterceptor) {
    this.requestInterceptors.push(interceptor);
  }

  // 添加响应拦截器
  addResponseInterceptor(interceptor: ResponseInterceptor) {
    this.responseInterceptors.push(interceptor);
  }

  // 添加错误拦截器
  addErrorInterceptor(interceptor: ErrorInterceptor) {
    this.errorInterceptors.push(interceptor);
  }

  // 获取存储的token
  private getToken(): string | null {
    try {
      return uni.getStorageSync('token');
    } catch (error) {
      console.error('获取token失败:', error);
      return null;
    }
  }

  // 设置默认请求头
  private getDefaultHeaders(): Record<string, string> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json'
    };

    const token = this.getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    return headers;
  }

  // 显示加载提示
  private showLoading(text: string = '加载中...') {
    uni.showLoading({
      title: text,
      mask: true
    });
  }

  // 隐藏加载提示
  private hideLoading() {
    uni.hideLoading();
  }

  // 显示错误提示
  private showError(message: string) {
    uni.showToast({
      title: message,
      icon: 'none',
      duration: 2000
    });
  }

  // 执行请求拦截器
  private async executeRequestInterceptors(config: RequestConfig): Promise<RequestConfig> {
    let result = config;
    for (const interceptor of this.requestInterceptors) {
      result = await interceptor(result);
    }
    return result;
  }

  // 执行响应拦截器
  private async executeResponseInterceptors(response: any): Promise<any> {
    let result = response;
    for (const interceptor of this.responseInterceptors) {
      result = await interceptor(result);
    }
    return result;
  }

  // 执行错误拦截器
  private async executeErrorInterceptors(error: any): Promise<any> {
    let result = error;
    for (const interceptor of this.errorInterceptors) {
      result = await interceptor(result);
    }
    return result;
  }

  // 核心请求方法
  private async makeRequest<T = any>(config: RequestConfig, retryCount: number = 0): Promise<ApiResponse<T>> {
    try {
      // 执行请求拦截器
      const processedConfig = await this.executeRequestInterceptors(config);

      // 显示加载提示
      if (processedConfig.showLoading !== false) {
        this.showLoading(processedConfig.loadingText);
      }

      // 构建完整URL
      const fullUrl = processedConfig.url.startsWith('http') 
        ? processedConfig.url 
        : this.baseURL + processedConfig.url;

      // 合并请求头
      const headers = {
        ...this.getDefaultHeaders(),
        ...processedConfig.header
      };

      // 发起请求
      const response = await new Promise<UniApp.RequestSuccessCallbackResult>((resolve, reject) => {
        uni.request({
          url: fullUrl,
          method: (processedConfig.method === 'PATCH' ? 'POST' : processedConfig.method) || 'GET',
          data: processedConfig.data,
          header: headers,
          timeout: processedConfig.timeout || this.defaultTimeout,
          success: resolve,
          fail: reject
        });
      });

      // 隐藏加载提示
      if (processedConfig.showLoading !== false) {
        this.hideLoading();
      }

      // 执行响应拦截器
      const processedResponse = await this.executeResponseInterceptors(response);

      // 检查HTTP状态码
      if (response.statusCode >= 200 && response.statusCode < 300) {
        return processedResponse.data as ApiResponse<T>;
      } else {
        throw new Error(`HTTP ${response.statusCode}: ${response.data?.message || '请求失败'}`);
      }

    } catch (error: any) {
      // 隐藏加载提示
      if (config.showLoading !== false) {
        this.hideLoading();
      }

      // 重试逻辑
      const maxRetry = config.retry ?? this.defaultRetry;
      if (retryCount < maxRetry) {
        console.log(`请求失败，正在重试 (${retryCount + 1}/${maxRetry}):`, error.message);
        await new Promise(resolve => setTimeout(resolve, 1000 * (retryCount + 1))); // 递增延迟
        return this.makeRequest(config, retryCount + 1);
      }

      // 执行错误拦截器
      const processedError = await this.executeErrorInterceptors(error);
      
      // 显示错误提示
      let errorMessage = '网络请求失败';
      
      if (processedError.data && typeof processedError.data === 'object' && 'message' in processedError.data) {
        errorMessage = processedError.data.message;
      } else if (processedError.errMsg) {
        errorMessage = processedError.errMsg;
      } else if (processedError.message) {
        errorMessage = processedError.message;
      }
      
      this.showError(errorMessage);
      
      throw processedError;
    }
  }

  // GET 请求
  async get<T = any>(url: string, params?: any, config?: Partial<RequestConfig>): Promise<ApiResponse<T>> {
    const requestConfig: RequestConfig = {
      url: params ? `${url}?${this.buildQueryString(params)}` : url,
      method: 'GET',
      ...config
    };
    return this.makeRequest<T>(requestConfig);
  }

  // POST 请求
  async post<T = any>(url: string, data?: any, config?: Partial<RequestConfig>): Promise<ApiResponse<T>> {
    const requestConfig: RequestConfig = {
      url,
      method: 'POST',
      data,
      ...config
    };
    return this.makeRequest<T>(requestConfig);
  }

  // PUT 请求
  async put<T = any>(url: string, data?: any, config?: Partial<RequestConfig>): Promise<ApiResponse<T>> {
    const requestConfig: RequestConfig = {
      url,
      method: 'PUT',
      data,
      ...config
    };
    return this.makeRequest<T>(requestConfig);
  }

  // DELETE 请求
  async delete<T = any>(url: string, config?: Partial<RequestConfig>): Promise<ApiResponse<T>> {
    const requestConfig: RequestConfig = {
      url,
      method: 'DELETE',
      ...config
    };
    return this.makeRequest<T>(requestConfig);
  }

  // PATCH 请求
  async patch<T = any>(url: string, data?: any, config?: Partial<RequestConfig>): Promise<ApiResponse<T>> {
    const requestConfig: RequestConfig = {
      url,
      method: 'PATCH',
      data,
      ...config
    };
    return this.makeRequest<T>(requestConfig);
  }

  // 文件上传
  async upload<T = any>(url: string, filePath: string, name: string = 'file', formData?: Record<string, any>): Promise<ApiResponse<T>> {
    return new Promise((resolve, reject) => {
      const fullUrl = url.startsWith('http') ? url : this.baseURL + url;
      const token = this.getToken();
      
      const headers: Record<string, string> = {};
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      uni.uploadFile({
        url: fullUrl,
        filePath,
        name,
        formData,
        header: headers,
        success: (response) => {
          try {
            const data = JSON.parse(response.data);
            resolve(data);
          } catch (error) {
            reject(new Error('响应数据解析失败'));
          }
        },
        fail: (error) => {
          reject(error);
        }
      });
    });
  }

  // 构建查询字符串
  private buildQueryString(params: Record<string, any>): string {
    const queryString = Object.keys(params)
      .filter(key => params[key] !== undefined && params[key] !== null)
      .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
      .join('&');
    return queryString;
  }
}

// 创建请求实例
const request = new HttpRequest();

// 添加默认请求拦截器
request.addRequestInterceptor((config) => {
  console.log('发起请求:', config.method, config.url);
  return config;
});

// 添加默认响应拦截器
request.addResponseInterceptor((response) => {
  console.log('响应数据:', response.statusCode, response.data);
  return response;
});

// 添加默认错误拦截器
request.addErrorInterceptor((error) => {
  console.error('请求错误:', error);
  
  // 处理token过期
  if (error.statusCode === 401) {
    uni.removeStorageSync('token');
    uni.removeStorageSync('userInfo');
    uni.reLaunch({
      url: '/pages/login/login'
    });
  }
  
  return error;
});

export default request;
export { HttpRequest, type ApiResponse, type RequestConfig };