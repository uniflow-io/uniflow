import { ExceptionInterface } from "../type";

/**
 * Exception to extend the error class to allow additional properties.
 *
 * @class Exception
 *
 * The exception allows
 * 1. message - Error message
 * 2. status - Error status in number. Helpful to define the HTTP status code
 * 3. code - Unique error code
 * 4. link - Know more link
 */
class Exception extends Error {
  constructor(message: string, status: number = 500, code?: string) {
    super(message);

    /**
     * Set error message
     */
    Object.defineProperty(this, 'message', {
      configurable: true,
      enumerable: false,
      value: code ? `${code}: ${message}` : message,
      writable: true,
    });

    /**
     * Set error name as a public property
     */
    Object.defineProperty(this, 'name', {
      configurable: true,
      enumerable: false,
      value: this.constructor.name,
      writable: true,
    });

    /**
     * Set status as a public property
     */
    Object.defineProperty(this, 'status', {
      configurable: true,
      enumerable: false,
      value: status,
      writable: true,
    });

    /**
     * Set error code as a public property (only when defined)
     */
    if (code) {
      Object.defineProperty(this, 'code', {
        configurable: true,
        enumerable: false,
        value: code,
        writable: true,
      });
    }

    /**
     * Update the stack trace
     */
    if (Error.hasOwnProperty('captureStackTrace')) {
      Error.captureStackTrace(this, this.constructor);
      return;
    }

    Object.defineProperty(this, 'stack', {
      configurable: true,
      enumerable: false,
      value: new Error(message).stack,
      writable: true,
    });
  }
}

interface Exception extends ExceptionInterface {}
export { Exception };
