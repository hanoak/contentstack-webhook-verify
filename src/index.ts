import reqValidate from "./utils/validate.js";
import replayVerify from "./utils/replay-verify.js";
import { WebhookRequestBody } from "./types/index.js";
import makeRequest from "./utils/request.js";
import verifySignature from "./utils/signature-verify.js";
import WebhookError from "./utils/error.js";
import { Config, ConfigOptions } from "./types/index.js";
import defaultConfig from "./config/index.js";

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
