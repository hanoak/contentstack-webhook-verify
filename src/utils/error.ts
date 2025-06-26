class WebhookError extends Error {
  constructor(message: string) {
    super(message);
    Error.captureStackTrace(this, this.constructor);
  }
}

export default WebhookError;
