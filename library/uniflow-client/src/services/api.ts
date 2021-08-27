import { Service, Inject } from 'typedi';
import request, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import Env from './env';
import { ApiValidateException } from '../models';
import { ApiValidateExceptionErrors } from '../models/api-validate-exception';
import {
  EmailOrUsernameType,
  EmailType,
  NotEmptyStringType,
  PageNumberType,
  PaginationType,
  PasswordType,
  PathType,
  PerPageType,
  SlugType,
  UuidOrUsernameType,
  UuidType,
} from '../models/type-interface';
import {
  ConfigApiType,
  ContactApiType,
  FolderApiType,
  LeadApiType,
  ProgramApiType,
  UserApiType,
} from '../models/api-type-interface';
import axios from 'axios';
import ApiNotAuthorizedException from '../models/api-not-authorized-exception';
import ApiNotFoundException from '../models/api-not-found-exception';

export interface ApiOptions {
  token?: string;
}

@Service()
class Api {
  @Inject(() => Env)
  private env: Env;

  private getBaseUrl() {
    return `${this.env.get('apiUrl')}/api`;
  }

  private getQuery(query?: { [key: string]: string | number | undefined }): string {
    if (query === undefined) {
      return '';
    }

    const paths = Object.keys(query)
      .filter((key: string): boolean => {
        return query[key] !== undefined;
      })
      .map((key: string): string => {
        return `${key}=${query[key]}`;
      });

    return paths.length > 0 ? `?${paths.join('&')}` : '';
  }

  private getOptions(options?: ApiOptions): AxiosRequestConfig {
    return options?.token
      ? {
          headers: {
            'Uniflow-Authorization': `Bearer ${options.token}`,
          },
        }
      : {};
  }

  private handleApiError(error: any) {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError;
      if (axiosError.response) {
        if (axiosError.response.status === 400) {
          return new ApiNotFoundException();
        } else if (axiosError.response.status === 401) {
          return new ApiNotAuthorizedException();
        } else if (axiosError.response.status === 422) {
          const errors: ApiValidateExceptionErrors = {};

          if (axiosError.response.data.validation) {
            for (const item of axiosError.response.data.validation) {
              errors[item.key] = errors[item.key] || [];
              for (const message of item.messages) {
                errors[item.key].push(message);
              }
            }
          }

          return new ApiValidateException(errors);
        }
      }
    }

    return error;
  }

  async login(body: {
    username: EmailOrUsernameType;
    password: PasswordType;
  }): Promise<{ token: string; uid: string }> {
    try {
      const response = await request.post(`${this.getBaseUrl()}/login`, body);
      return response.data;
    } catch (error) {
      throw this.handleApiError(error);
    }
  }

  async loginFacebook(
    body: { access_token: string },
    options?: ApiOptions
  ): Promise<{ token: string; uid: string }> {
    try {
      const response = await request.post(
        `${this.getBaseUrl()}/login-facebook`,
        body,
        this.getOptions(options)
      );
      return response.data;
    } catch (error) {
      throw this.handleApiError(error);
    }
  }

  async loginGithub(
    body: { code: string },
    options?: ApiOptions
  ): Promise<{ token: string; uid: string }> {
    try {
      const response = await request.post(
        `${this.getBaseUrl()}/login-github`,
        body,
        this.getOptions(options)
      );
      return response.data;
    } catch (error) {
      throw this.handleApiError(error);
    }
  }

  async contact(body: Pick<ContactApiType, 'email' | 'message'>): Promise<boolean> {
    try {
      const response = await request.post(`${this.getBaseUrl()}/contacts`, body);
      return response.data;
    } catch (error) {
      throw this.handleApiError(error);
    }
  }

  async updateFolder(
    path: { uid: UuidType },
    body: Partial<Pick<FolderApiType, 'name' | 'path'> & { slug: string }>,
    options: ApiOptions & Required<Pick<ApiOptions, 'token'>>
  ): Promise<FolderApiType> {
    try {
      const response = await request.put(
        `${this.getBaseUrl()}/folders/${path.uid}`,
        body,
        this.getOptions(options)
      );
      return response.data;
    } catch (error) {
      throw this.handleApiError(error);
    }
  }

  async deleteFolder(
    path: { uid: UuidType },
    options: ApiOptions & Required<Pick<ApiOptions, 'token'>>
  ): Promise<boolean> {
    try {
      const response = await request.delete(
        `${this.getBaseUrl()}/folders/${path.uid}`,
        this.getOptions(options)
      );
      return response.data;
    } catch (error) {
      throw this.handleApiError(error);
    }
  }

  async createLead(body: Partial<LeadApiType>): Promise<LeadApiType> {
    try {
      const response = await request.post(`${this.getBaseUrl()}/leads`, body);
      return response.data;
    } catch (error) {
      throw this.handleApiError(error);
    }
  }

  async getLead(path: { uid: UuidType }): Promise<LeadApiType> {
    try {
      const response = await request.get(`${this.getBaseUrl()}/leads/${path.uid}`);
      return response.data;
    } catch (error) {
      throw this.handleApiError(error);
    }
  }

  async updateLead(path: { uid: UuidType }, body: Partial<LeadApiType>): Promise<LeadApiType> {
    try {
      const response = await request.put(`${this.getBaseUrl()}/leads/${path.uid}`, body);
      return response.data;
    } catch (error) {
      throw this.handleApiError(error);
    }
  }

  async getPrograms(query?: {
    page?: PageNumberType;
    perPage?: PerPageType;
  }): Promise<PaginationType<ProgramApiType>> {
    try {
      const response = await request.get(`${this.getBaseUrl()}/programs${this.getQuery(query)}`);
      return response.data;
    } catch (error) {
      throw this.handleApiError(error);
    }
  }

  async updateProgram(
    path: { uid: UuidType },
    body: Partial<ProgramApiType & { slug: string }>,
    options: ApiOptions & Required<Pick<ApiOptions, 'token'>>
  ): Promise<ProgramApiType> {
    try {
      const response = await request.put(
        `${this.getBaseUrl()}/programs/${path.uid}`,
        body,
        this.getOptions(options)
      );
      return response.data;
    } catch (error) {
      throw this.handleApiError(error);
    }
  }

  async deleteProgram(
    path: { uid: UuidType },
    options: ApiOptions & Required<Pick<ApiOptions, 'token'>>
  ): Promise<boolean> {
    try {
      const response = await request.delete(
        `${this.getBaseUrl()}/programs/${path.uid}`,
        this.getOptions(options)
      );
      return response.data;
    } catch (error) {
      throw this.handleApiError(error);
    }
  }

  async getProgramFlows(
    path: { uid: UuidType },
    options?: ApiOptions
  ): Promise<{ data: string | null }> {
    try {
      const response = await request.get(
        `${this.getBaseUrl()}/programs/${path.uid}/flows`,
        this.getOptions(options)
      );
      return response.data;
    } catch (error) {
      throw this.handleApiError(error);
    }
  }

  async updateProgramFlows(
    path: { uid: UuidType },
    body: { data: string | null },
    options: ApiOptions & Required<Pick<ApiOptions, 'token'>>
  ): Promise<boolean> {
    try {
      const response = await request.put(
        `${this.getBaseUrl()}/programs/${path.uid}/flows`,
        body,
        this.getOptions(options)
      );
      return response.data;
    } catch (error) {
      throw this.handleApiError(error);
    }
  }

  async createUser(body: { email: EmailType; password: PasswordType }): Promise<UserApiType> {
    try {
      const response = await request.post(`${this.getBaseUrl()}/users`, body);
      return response.data;
    } catch (error) {
      throw this.handleApiError(error);
    }
  }

  async getUserSettings(
    path: { uid: UuidOrUsernameType },
    options: ApiOptions & Required<Pick<ApiOptions, 'token'>>
  ): Promise<UserApiType> {
    try {
      const response = await request.get(
        `${this.getBaseUrl()}/users/${path.uid}/settings`,
        this.getOptions(options)
      );
      return response.data;
    } catch (error) {
      throw this.handleApiError(error);
    }
  }

  async updateUserSettings(
    path: { uid: UuidOrUsernameType },
    body: Partial<UserApiType>,
    options: ApiOptions & Required<Pick<ApiOptions, 'token'>>
  ): Promise<UserApiType> {
    try {
      const response = await request.put(
        `${this.getBaseUrl()}/users/${path.uid}/settings`,
        body,
        this.getOptions(options)
      );
      return response.data;
    } catch (error) {
      throw this.handleApiError(error);
    }
  }

  async getAdminConfig(
    path: { uid: UuidOrUsernameType },
    options: ApiOptions & Required<Pick<ApiOptions, 'token'>>
  ): Promise<ConfigApiType> {
    try {
      const response = await request.get(
        `${this.getBaseUrl()}/users/${path.uid}/admin-config`,
        this.getOptions(options)
      );
      return response.data;
    } catch (error) {
      throw this.handleApiError(error);
    }
  }

  async updateAdminConfig(
    path: { uid: UuidOrUsernameType },
    body: object,
    options: ApiOptions & Required<Pick<ApiOptions, 'token'>>
  ): Promise<ConfigApiType> {
    try {
      const response = await request.put(
        `${this.getBaseUrl()}/users/${path.uid}/admin-config`,
        body,
        this.getOptions(options)
      );
      return response.data;
    } catch (error) {
      throw this.handleApiError(error);
    }
  }

  async getUserFolders(
    path: { uid: UuidOrUsernameType },
    query?: { page?: PageNumberType; perPage?: PerPageType; path?: PathType },
    options?: ApiOptions
  ): Promise<PaginationType<FolderApiType>> {
    try {
      const response = await request.get(
        `${this.getBaseUrl()}/users/${path.uid}/folders${this.getQuery(query)}`,
        this.getOptions(options)
      );
      return response.data;
    } catch (error) {
      throw this.handleApiError(error);
    }
  }

  async createUserFolder(
    path: { uid: UuidOrUsernameType },
    body: { name: NotEmptyStringType; slug?: SlugType; path?: PathType },
    options: ApiOptions & Required<Pick<ApiOptions, 'token'>>
  ): Promise<FolderApiType> {
    try {
      const reponse = await request.post(
        `${this.getBaseUrl()}/users/${path.uid}/folders`,
        body,
        this.getOptions(options)
      );
      return reponse.data;
    } catch (error) {
      throw this.handleApiError(error);
    }
  }

  async getUserPrograms(
    path: { uid: UuidOrUsernameType },
    query?: { page?: PageNumberType; perPage?: PerPageType; path?: PathType },
    options?: ApiOptions
  ): Promise<PaginationType<ProgramApiType>> {
    try {
      const response = await request.get(
        `${this.getBaseUrl()}/users/${path.uid}/programs${this.getQuery(query)}`,
        this.getOptions(options)
      );
      return response.data;
    } catch (error) {
      throw this.handleApiError(error);
    }
  }

  async createUserProgram(
    path: { uid: UuidOrUsernameType },
    body: {
      name: NotEmptyStringType;
      slug?: SlugType;
      path?: PathType;
      clients?: NotEmptyStringType[];
      tags?: NotEmptyStringType[];
      description?: NotEmptyStringType | null;
      isPublic?: boolean;
    },
    options: ApiOptions & Required<Pick<ApiOptions, 'token'>>
  ): Promise<ProgramApiType> {
    try {
      const response = await request.post(
        `${this.getBaseUrl()}/users/${path.uid}/programs`,
        body,
        this.getOptions(options)
      );
      return response.data;
    } catch (error) {
      throw this.handleApiError(error);
    }
  }
}

export default Api;
