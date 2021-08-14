class ApiException extends Error {
  constructor(errors) {
    super('api exception');

    // @ts-expect-error ts-migrate(2339) FIXME: Property 'errors' does not exist on type 'ApiExcep... Remove this comment to see the full error message
    this.errors = { ...errors };
  }
}

export { ApiException };
