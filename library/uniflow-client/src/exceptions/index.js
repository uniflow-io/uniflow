class ApiException extends Error {
  constructor(errors) {
    super('form exception');

    this.errors = {...errors}
  }
}

export { ApiException };
