export type ApiExceptionErrors = { [key: string]: string[] }

class ApiException extends Error {
  constructor(public errors: ApiExceptionErrors) {
    super('api exception');

    this.errors = { ...errors };
  }
}

export default ApiException;
