export type ApiValidateExceptionErrors<T extends string = string> = { [key in T]?: string[] };

class ApiValidateException extends Error {
  constructor(public errors: ApiValidateExceptionErrors) {
    super('api exception');

    this.errors = { ...errors };
  }
}

export default ApiValidateException;
