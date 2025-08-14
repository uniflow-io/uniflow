import { ApiValidateException } from '../models/api-exceptions.js';
import { ApiNotAuthorizedException } from '../models/api-exceptions.js';
import { ApiNotFoundException } from '../models/api-exceptions.js';

class Api {
  constructor(baseUrl) {
    this.baseUrl = baseUrl;
  }

  getBaseUrl() {
    return `${this.baseUrl}/api/v1/uniflow`;
  }

  getQuery(query) {
    if (query === undefined) {
      return '';
    }

    const paths = Object.keys(query)
      .filter((key) => {
        return query[key] !== undefined;
      })
      .map((key) => {
        return `${key}=${query[key]}`;
      });

    return paths.length > 0 ? `?${paths.join('&')}` : '';
  }

  getOptions(options, method = 'GET', body = null) {
    const fetchOptions = {
      method,
      headers: {
        'Content-Type': 'application/json'
      }
    };

    if (options?.token) {
      fetchOptions.headers['Authorization'] = `Bearer ${options.token}`;
    }

    if (body) {
      fetchOptions.body = JSON.stringify(body);
    }

    return fetchOptions;
  }

  async handleApiError(response) {
    if (!response.ok) {
      if (response.status === 400) {
        return new ApiNotFoundException();
      } else if (response.status === 401) {
        return new ApiNotAuthorizedException();
      } else if (response.status === 422) {
        const data = await response.json();
        const errors = {};

        if (data.validation) {
          for (const item of data.validation) {
            errors[item.key] = errors[item.key] || [];
            for (const message of item.messages) {
              errors[item.key]?.push(message);
            }
          }
        }

        return new ApiValidateException(errors);
      }
    }

    return response;
  }

  async fetchApi(url, options, method = 'GET', body = null) {
    const response = await fetch(url, this.getOptions(options, method, body));

    if (!response.ok) {
      throw await this.handleApiError(response);
    }

    return await response.json();
  }

  async getProgram(uid, options) {
    return this.fetchApi(
      `${this.getBaseUrl()}/program/${uid}`,
      options,
      'GET'
    );
  }

  async updateProgram(uid, body, options) {
    return this.fetchApi(
      `${this.getBaseUrl()}/program/${uid}`,
      options,
      'PUT',
      body
    );
  }

  async deleteProgram(uid, options) {
    return this.fetchApi(
      `${this.getBaseUrl()}/program/${path.uid}`,
      options,
      'DELETE'
    );
  }

  async getProgramFlows(uid, options) {
    return this.fetchApi(
      `${this.getBaseUrl()}/program/${uid}/flows`,
      options,
      'GET'
    );
  }

  async updateProgramFlows(uid, body, options) {
    return this.fetchApi(
      `${this.getBaseUrl()}/program/${uid}/flows`,
      options,
      'PUT',
      body
    );
  }
}

export default Api;
