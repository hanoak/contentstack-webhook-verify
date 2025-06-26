import { CS_REGIONS } from "../constants/index.js";
import { WebhookRequestBody } from "../types/index.js";
import WebhookError from "./error.js";
import { ConfigOptions } from "../types/index.js";

/**
 * Validates the parameters required for verifying a webhook request.
 *
 * @param headerSignature - The signature from the request header to be validated.
 * @param reqBody - The body of the webhook request.
 * @param options - Configuration options for validation, including replay protection, region, and timeouts.
 * @throws {WebhookError} Throws if any of the parameters are invalid or missing required properties.
 */
const reqValidate = (
  headerSignature: string,
  reqBody: WebhookRequestBody,
  options: ConfigOptions,
) => {
  if (!headerSignature || typeof headerSignature !== "string") {
    throw new WebhookError("Invalid header signature");
  }

  if (!reqBody || typeof reqBody !== "object") {
    throw new WebhookError("Invalid request body");
  }

  if (!options || typeof options !== "object") {
    throw new WebhookError("Invalid options");
  }

  if (typeof options.replayVerify !== "undefined") {
    if (typeof options.replayVerify !== "boolean") {
      throw new WebhookError("Invalid replayVerify option");
    }
  }

  if (typeof options.replayThreshold !== "undefined") {
    if (
      options.replayThreshold <= 0 ||
      typeof options.replayThreshold !== "number"
    ) {
      throw new WebhookError("Invalid replayThreshold option");
    }
  }

  if (typeof options.requestTimeout !== "undefined") {
    if (
      options.requestTimeout <= 0 ||
      typeof options.requestTimeout !== "number"
    ) {
      throw new WebhookError("Invalid requestTimeout option");
    }
  }

  if (typeof options.region !== "undefined") {
    if (
      typeof options.region !== "string" ||
      !CS_REGIONS.includes(options.region)
    ) {
      throw new WebhookError("Invalid region option");
    }
  }

  if (typeof options.customRegionUrl !== "undefined") {
    if (
      !options.customRegionUrl ||
      typeof options.customRegionUrl !== "string"
    ) {
      throw new WebhookError("Invalid customRegionUrl option");
    }
  }
};

export default reqValidate;
