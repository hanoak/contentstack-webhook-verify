import { CS_REGIONS_URLS } from "../constants/index.js";

export interface WebhookRequestBody {
  triggered_at: string;
  [key: string]: unknown;
}

export interface ApiResponse {
  "signing-key": string;
  [key: string]: unknown;
}

export interface Config {
  replayVerify: boolean;
  replayThreshold: number;
  requestTimeout: number;
  region: string;
  customRegionUrl: string | undefined;
}

export type ConfigOptions = Partial<Config>;

export type RegionKey = keyof typeof CS_REGIONS_URLS;
