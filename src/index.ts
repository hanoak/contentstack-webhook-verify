import reqValidate from "./utils/validate.js";
import replayVerify from "./utils/replay-verify.js";
import { WebhookRequestBody } from "./types/index.js";
import makeRequest from "./utils/request.js";
import verifySignature from "./utils/signature-verify.js";
import WebhookError from "./utils/error.js";
import { Config, ConfigOptions } from "./types/index.js";
import defaultConfig from "./config/index.js";

/**
 * Verifies the authenticity of a webhook request by validating the signature,
 * checking for replay attacks, and ensuring the request body is valid.
 *
 * @param headerSignature - The signature provided in the webhook request header.
 * @param reqBody - The body of the webhook request to be verified.
 * @param options - Optional configuration options to override default verification behavior.
 * @returns A promise that resolves to `true` if verification succeeds, or throws a `WebhookError` if verification fails.
 *
 * @throws {WebhookError} If the request is invalid, the signature is incorrect, or a replay attack is detected.
 */
const verify = async (
  headerSignature: string,
  reqBody: WebhookRequestBody,
  options: ConfigOptions = defaultConfig,
): Promise<true | WebhookError> => {
  try {
    reqValidate(headerSignature, reqBody, options);

    const newConfig: Config = {
      ...defaultConfig,
      ...options,
    };

    replayVerify(reqBody.triggered_at, newConfig);

    const csPublicKey = (await makeRequest(newConfig))["signing-key"];

    verifySignature(headerSignature, csPublicKey, reqBody);

    console.info("Signature verified successfully.");
    return true;
  } catch (error: unknown) {
    if (error instanceof WebhookError) throw error;
    throw new WebhookError(
      (error as Error)?.message || "An error occurred during verification",
    );
  }
};

export default verify;

// Export types for TypeScript users
export type {
  WebhookRequestBody,
  Config,
  ConfigOptions,
  RegionKey,
} from "./types/index.js";
export { default as WebhookError } from "./utils/error.js";
