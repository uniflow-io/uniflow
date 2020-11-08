import request from 'axios'
import { Service } from 'typedi';
import { RequestConfig, RequestInterface, ResponseInterface } from './interfaces';

@Service()
export default class AxiosRequest implements RequestInterface {
  get(url: string, config?: RequestConfig): Promise<ResponseInterface> {
    return request.get(url, config)
  }
  delete(url: string, config?: RequestConfig): Promise<ResponseInterface> {
    return request.delete(url, config)
  }
  head(url: string, config?: RequestConfig): Promise<ResponseInterface> {
    return request.head(url, config)
  }
  options(url: string, config?: RequestConfig): Promise<ResponseInterface> {
    return request.options(url, config)
  }
  post(url: string, data?: any, config?: RequestConfig): Promise<ResponseInterface> {
    return request.post(url, data, config)
  }
  put(url: string, data?: any, config?: RequestConfig): Promise<ResponseInterface> {
    return request.put(url, data, config)
  }
  patch(url: string, data?: any, config?: RequestConfig): Promise<ResponseInterface> {
    return request.patch(url, data, config)
  }
}
