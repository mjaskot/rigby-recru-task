type StatusErrorPayload = {
  logMessage?: string;
  originalError?: Error;
  data?: any;
  responseData?: any;
};

export default class StatusError extends Error {
  constructor(
    public status: number,
    message: string,
    public payload?: StatusErrorPayload
  ) {
    super(message);
  }
}