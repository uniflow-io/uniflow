export interface ResponseInterface {
  data: any
}

export interface RequestConfig {
  headers?: any;
}

export interface RequestInterface {
  get(url: string, config?: RequestConfig): Promise<ResponseInterface>;
  delete(url: string, config?: RequestConfig): Promise<ResponseInterface>;
  head(url: string, config?: RequestConfig): Promise<ResponseInterface>;
  options(url: string, config?: RequestConfig): Promise<ResponseInterface>;
  post(url: string, data?: any, config?: RequestConfig): Promise<ResponseInterface>;
  put(url: string, data?: any, config?: RequestConfig): Promise<ResponseInterface>;
  patch(url: string, data?: any, config?: RequestConfig): Promise<ResponseInterface>;
}