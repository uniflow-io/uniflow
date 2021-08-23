export type ApiValidateExceptionErrors = { [key: string]: string[] }

class ApiValidateException extends Error {
  constructor(public errors: ApiValidateExceptionErrors) {
    super('api exception');

    this.errors = { ...errors };
  }
}

export default ApiValidateException;
