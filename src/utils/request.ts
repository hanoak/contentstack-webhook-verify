/* eslint-disable @typescript-eslint/no-explicit-any */
import * as https from "https";
import { IncomingMessage } from "http";
import { ApiResponse } from "../types/index.js";
import WebhookError from "./error.js";
import { CS_REGIONS_URLS } from "../constants/index.js";
import { Config } from "../types/index.js";
import { RegionKey } from "../types/index.js";

/**
 * Makes an HTTPS GET request to the specified URL or region endpoint with a configurable timeout.
 *
 * @param options - The configuration object containing request parameters such as region, custom URL, and timeout.
 * @returns A promise that resolves with the parsed JSON response as `ApiResponse`, or rejects with a `WebhookError` on failure.
 *
 * @throws {WebhookError} If the request times out, encounters a network error, receives a non-2xx status code, or fails to parse the response as JSON.
 *
 * @remarks
 * - Aborts the request if it exceeds the specified `requestTimeout`.
 * - Uses the `AbortController` API to handle request cancellation.
 * - Supports custom region URLs or falls back to predefined region endpoints.
 */
const makeRequest = (options: Config): Promise<ApiResponse> => {
  const url =
    options.customRegionUrl ?? CS_REGIONS_URLS[options.region as RegionKey];

  const controller = new AbortController();
  const { signal } = controller;

  // Set a timeout to abort the request
  const timeoutId = setTimeout(() => {
    controller.abort(
      new WebhookError(`Request timed out after ${options.requestTimeout}ms`),
    );
  }, options.requestTimeout);

  return new Promise((resolve, reject) => {
    https
      .get(url, { signal }, (res: IncomingMessage) => {
        clearTimeout(timeoutId);
        let data = "";

        if (
          res.statusCode === undefined ||
          res.statusCode < 200 ||
          res.statusCode >= 300
        ) {
          return reject(
            new WebhookError(
              `HTTP error! Status: ${res.statusCode || "Unknown"}`,
            ),
          );
        }

        res.on("data", (chunk: string | Buffer) => {
          data += chunk.toString();
        });

        res.on("end", () => {
          try {
            resolve(JSON.parse(data));
          } catch (e: any) {
            reject(
              new WebhookError(`Error parsing JSON from ${url}: ${e.message}`),
            );
          }
        });
      })
      .on("error", (err: Error) => {
        clearTimeout(timeoutId);
        reject(new WebhookError(`Network error for ${url}: ${err.message}`));
      });
  });
};

export default makeRequest;
