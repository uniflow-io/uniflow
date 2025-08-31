class ApiValidateException extends Error {
  constructor(errors) {
    super('api exception');

    this.errors = { ...errors };
  }
}

export { ApiValidateException };

class ApiNotAuthorizedException extends Error {}

export { ApiNotAuthorizedException };

class ApiNotFoundException extends Error {}

export { ApiNotFoundException };
