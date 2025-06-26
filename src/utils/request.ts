/* eslint-disable @typescript-eslint/no-explicit-any */
import * as https from "https";
import { IncomingMessage } from "http";
import { ApiResponse } from "../types/index.js";
import WebhookError from "./error.js";
import { WEBHOOK_TIMEOUT } from "../constants/index.js";

const makeRequest = (url: string): Promise<ApiResponse> => {
  const controller = new AbortController();
  const { signal } = controller;

  // Set a timeout to abort the request
  const timeoutId = setTimeout(() => {
    controller.abort(
      new WebhookError(`Request timed out after ${WEBHOOK_TIMEOUT}ms`),
    );
  }, WEBHOOK_TIMEOUT);

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
