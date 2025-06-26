/* eslint-disable @typescript-eslint/no-explicit-any */
import * as https from "https";
import { IncomingMessage } from "http";
import { ApiResponse } from "../types/index.js";

const makeRequest = (url: string): Promise<ApiResponse> => {
  return new Promise((resolve, reject) => {
    https
      .get(url, (res: IncomingMessage) => {
        let data = "";

        if (
          res.statusCode === undefined ||
          res.statusCode < 200 ||
          res.statusCode >= 300
        ) {
          return reject(
            new Error(`HTTP error! Status: ${res.statusCode || "Unknown"}`),
          );
        }

        res.on("data", (chunk: string | Buffer) => {
          data += chunk.toString();
        });

        res.on("end", () => {
          try {
            resolve(JSON.parse(data));
          } catch (e: any) {
            reject(new Error(`Error parsing JSON from ${url}: ${e.message}`));
          }
        });
      })
      .on("error", (err: Error) => {
        reject(new Error(`Network error for ${url}: ${err.message}`));
      });
  });
};

export default makeRequest;
