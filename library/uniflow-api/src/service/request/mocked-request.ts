import { Service } from 'typedi';
import { RequestConfig, RequestInterface, ResponseInterface } from './interfaces';

@Service()
export default class MockedRequest implements RequestInterface {
  get(url: string, config?: RequestConfig): Promise<ResponseInterface> {
    let d = undefined

    if(url.indexOf('https://graph.facebook.com/app/?access_token=') === 0) {
      d = {
        id: 'test_facebook_app_id'
      }
    } else if(url === 'https://graph.facebook.com/me/?access_token=valid-facebook-token') {
      d = {
        id: 1
      }
    } else if(url === 'https://graph.facebook.com/me/?access_token=invalid-facebook-token') {
      d = {
        id: undefined
      }
    } else if(url === 'https://api.github.com/user' && config && config.headers
    && config.headers['Authorization'] === 'Bearer 1-github-access-token') {
      d = {
        id: 1
      }
    }
    
    return Promise.resolve({
      data: d
    })
  }
  delete(url: string, config?: RequestConfig): Promise<ResponseInterface> {
    throw new Error('Method not implemented.');
  }
  head(url: string, config?: RequestConfig): Promise<ResponseInterface> {
    throw new Error('Method not implemented.');
  }
  options(url: string, config?: RequestConfig): Promise<ResponseInterface> {
    throw new Error('Method not implemented.');
  }
  post(url: string, data?: any, config?: RequestConfig): Promise<ResponseInterface> {
    let d = undefined

    if(url === 'https://github.com/login/oauth/access_token') {
      d = {
        access_token: undefined
      }

      if(data && data.code === 'valid-github-code') {
        d = {
          access_token: '1-github-access-token'
        }
      }
    }

    return Promise.resolve({
      data: d
    })
  }
  put(url: string, data?: any, config?: RequestConfig): Promise<ResponseInterface> {
    throw new Error('Method not implemented.');
  }
  patch(url: string, data?: any, config?: RequestConfig): Promise<ResponseInterface> {
    throw new Error('Method not implemented.');
  }
}
