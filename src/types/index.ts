export interface WebhookRequestBody {
  triggered_at: string;
  [key: string]: unknown;
}

export interface ApiResponse {
  "signing-key": string;
  [key: string]: unknown;
}
