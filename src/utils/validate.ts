import { CS_REGIONS } from "../constants/index.js";
import { WebhookRequestBody } from "../types/index.js";
import WebhookError from "./error.js";

const reqValidate = (
  headerSignature: string,
  reqBody: WebhookRequestBody,
  region: string,
) => {
  if (!headerSignature || typeof headerSignature !== "string") {
    throw new WebhookError("Invalid header signature");
  }

  if (!reqBody || typeof reqBody !== "object") {
    throw new WebhookError("Invalid request body");
  }

  if (!region || typeof region !== "string" || !CS_REGIONS.includes(region)) {
    throw new WebhookError("Invalid region");
  }
};

export default reqValidate;
