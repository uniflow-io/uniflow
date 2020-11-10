class ApiException extends Error {
  constructor(errors) {
    super('api exception');

    this.errors = {...errors}
  }
}

export { ApiException };
