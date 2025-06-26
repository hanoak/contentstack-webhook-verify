/**
 * Custom error class for handling webhook-related errors.
 *
 * Extends the built-in `Error` class to provide a specific error type
 * for webhook operations. Captures the stack trace at the point where
 * the error is instantiated.
 *
 * @example
 * throw new WebhookError('Invalid webhook signature');
 */
class WebhookError extends Error {
  constructor(message: string) {
    super(message);
    Error.captureStackTrace(this, this.constructor);
  }
}

export default WebhookError;
