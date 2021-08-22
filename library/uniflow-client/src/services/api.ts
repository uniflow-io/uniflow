import { Service, Inject } from 'typedi';
import request, { AxiosRequestConfig, AxiosResponse } from 'axios';
import Env from './env';
import { ApiException } from '../models';
import { ApiExceptionErrors } from '../models/api-exception';
import { EmailOrUsernameType, EmailType, NotEmptyStringType, PageNumberType, PaginationType, PathType, PerPageType, SlugType, UuidOrUsernameType, UuidType } from '../models/type-interface';
import { ConfigApiType, ContactApiType, FolderApiType, LeadApiType, ProgramApiType, UserApiType } from '../models/api-type-interface';

export interface ApiOptions {
  token?: string
}

export interface Program {
  name: string,
  description: string,
}

@Service()
class Api {
  @Inject(() => Env)
  private env: Env;

  private getBaseUrl() {
    return `${this.env.get('apiUrl')}/api`;
  }

  private getQuery(query?: {[key: string]: string|number|undefined}): string {
    if(query === undefined) {
      return ''
    }

    const paths = Object.keys(query)
      .filter((key: string): boolean => {
        return query[key] !== undefined
      })
      .map((key: string): string => {
        return `${key}=${query[key]}`
      })

    return paths.length > 0 ? `?${paths.join('&')}` : ''
  }

  private getOptions(options?: ApiOptions): AxiosRequestConfig {
    return options?.token
      ? {
        headers: {
          'Uniflow-Authorization': `Bearer ${options.token}`,
        },
      }
      : {}
  }

  private handleErrors(response: AxiosResponse) {
    const errors: ApiExceptionErrors = {};

    if (response.data.validation) {
      for (const item of response.data.validation) {
        errors[item.key] = errors[item.key] || [];
        for (const message of item.messages) {
          errors[item.key].push(message);
        }
      }
    }

    return errors;
  }

  async login(body: {username: EmailOrUsernameType, password: string}): Promise<{token: string, uid: string}> {
    const response = await request.post(`${this.getBaseUrl()}/login`, body);
    return response.data
  }

  async loginFacebook(body: {access_token: string}, options?: ApiOptions): Promise<{token: string, uid: string}> {
    const response = await request.post(`${this.getBaseUrl()}/login-facebook`,body,this.getOptions(options));
    return response.data
  }

  async loginGithub(body: {code: string}, options?: ApiOptions): Promise<{token: string, uid: string}> {
    const response = await request.post(`${this.getBaseUrl()}/login-github`, body, this.getOptions(options));
    return response.data
  }

  async contact(body: Pick<ContactApiType, 'email'|'message'>): Promise<boolean> {
    try {
      const response = await request.post(`${this.getBaseUrl()}/contacts`, body);
      return response.data;
    } catch (error) {
      throw new ApiException(this.handleErrors(error.response));
    }
  };

  async updateFolder(path: {uid: UuidType}, body: Partial<Pick<FolderApiType, 'name'|'path'|'slug'>>, options: ApiOptions & Required<Pick<ApiOptions, 'token'>>): Promise<FolderApiType> {
    const response = await request.put(`${this.getBaseUrl()}/folders/${path.uid}`, body, this.getOptions(options));
    return response.data
  }

  async deleteFolder(path: {uid: UuidType}, options: ApiOptions & Required<Pick<ApiOptions, 'token'>>): Promise<boolean> {
    const response = await request.delete(`${this.getBaseUrl()}/folders/${path.uid}`, this.getOptions(options));
    return response.data
  }

  async createLead(body: Partial<LeadApiType>): Promise<LeadApiType> {
    try {
      const response = await request.post(`${this.getBaseUrl()}/leads`, body);
      return response.data;
    } catch (error) {
      throw new ApiException(this.handleErrors(error.response));
    }
  };
  
  async getLead(path: {uid: UuidType}): Promise<LeadApiType> {
    const response = await request.get(`${this.getBaseUrl()}/leads/${path.uid}`);
    return response.data;
  };

  async updateLead(path: {uid: UuidType}, body: Partial<LeadApiType>): Promise<LeadApiType> {
    try {
      const response = await request.put(`${this.getBaseUrl()}/leads/${path.uid}`, body);
      return response.data;
    } catch (error) {
      throw new ApiException(this.handleErrors(error.response));
    }
  };

  async getPrograms(query?: {page?: PageNumberType, perPage?: PerPageType}): Promise<PaginationType<ProgramApiType>> {
    try {
      const response = await request.get(`${this.getBaseUrl()}/programs${this.getQuery(query)}`);
      return response.data;
    } catch (error) {
      return { data: [], total: 0 };
    }
  };

  async updateProgram(path: {uid: UuidType}, body: Partial<ProgramApiType>, options: ApiOptions & Required<Pick<ApiOptions, 'token'>>): Promise<ProgramApiType> {
    const response = await request.put(`${this.getBaseUrl()}/programs/${path.uid}`, body, this.getOptions(options));
    return response.data
  }

  async deleteProgram(path: {uid: UuidType}, options: ApiOptions & Required<Pick<ApiOptions, 'token'>>): Promise<boolean> {
    const response = await request.delete(`${this.getBaseUrl()}/programs/${path.uid}`, this.getOptions(options));
    return response.data
  }

  async getProgramFlows(path: {uid: UuidType}, options?: ApiOptions): Promise<{data: string|null}> {
    const response = await request.get(`${this.getBaseUrl()}/programs/${path.uid}/flows`, this.getOptions(options));
    return response.data
  }

  async updateProgramFlows(path: {uid: UuidType}, body: {data: string|null}, options: ApiOptions & Required<Pick<ApiOptions, 'token'>>): Promise<boolean> {
    const response = await request.put(`${this.getBaseUrl()}/programs/${path.uid}/flows`, body, this.getOptions(options))
    return response.data
  }

  async createUser(body: {email: EmailType, password: string}): Promise<UserApiType> {
    const response = await request.post(`${this.getBaseUrl()}/users`, body);
    return response.data
  }

  async getUserSettings(path: {uid: UuidOrUsernameType}, options: ApiOptions & Required<Pick<ApiOptions, 'token'>>): Promise<UserApiType> {
    const response = await request.get(`${this.getBaseUrl()}/users/${path.uid}/settings`, this.getOptions(options))
    return response.data
  }

  async updateUserSettings(path: {uid: UuidOrUsernameType}, body: Partial<UserApiType>, options: ApiOptions & Required<Pick<ApiOptions, 'token'>>): Promise<UserApiType> {
    const response = await request.put(`${this.getBaseUrl()}/users/${path.uid}/settings`, body, this.getOptions(options))
    return response.data
  }

  async getAdminConfig(path: {uid: UuidOrUsernameType}, options: ApiOptions & Required<Pick<ApiOptions, 'token'>>): Promise<ConfigApiType> {
    const response = await request.get(`${this.getBaseUrl()}/users/${path.uid}/admin-config`, this.getOptions(options));
    return response.data
  }

  async updateAdminConfig(path: {uid: UuidOrUsernameType}, body: object, options: ApiOptions & Required<Pick<ApiOptions, 'token'>>): Promise<ConfigApiType> {
    const response = await request.put(`${this.getBaseUrl()}/users/${path.uid}/admin-config`, body, this.getOptions(options));
    return response.data
  }

  async getUserFolders(path: {uid: UuidOrUsernameType}, query?: {page?: PageNumberType, perPage?: PerPageType, path?: PathType}, options?: ApiOptions): Promise<PaginationType<FolderApiType>> {
    const response = await request.get(`${this.getBaseUrl()}/users/${path.uid}/folders${this.getQuery(query)}`, this.getOptions(options));
    return response.data
  }

  async createUserFolder(path: {uid: UuidOrUsernameType}, body: {name: NotEmptyStringType, slug?: SlugType, path?: PathType}, options: ApiOptions & Required<Pick<ApiOptions, 'token'>>): Promise<FolderApiType> {
    const reponse = await request.post(`${this.getBaseUrl()}/users/${path.uid}/folders`, body, this.getOptions(options));
    return reponse.data
  }

  async getUserPrograms(path: {uid: UuidOrUsernameType}, query?: {page?: PageNumberType, perPage?: PerPageType, path?: PathType}, options?: ApiOptions): Promise<PaginationType<ProgramApiType>> {
    const response = await request.get(`${this.getBaseUrl()}/users/${path.uid}/programs${this.getQuery(query)}`, this.getOptions(options));
    return response.data
  }

  async createUserProgram(path: {uid: UuidOrUsernameType}, body: {
    name: NotEmptyStringType
    slug?: SlugType
    path?: PathType
    clients?: NotEmptyStringType[]
    tags?: NotEmptyStringType[]
    description?: NotEmptyStringType | null
    isPublic?: boolean
  }, options: ApiOptions & Required<Pick<ApiOptions, 'token'>>): Promise<ProgramApiType> {
    const response = await request.post(`${this.getBaseUrl()}/users/${path.uid}/programs`, body, this.getOptions(options));
    return response.data
  }
}

export default Api;
