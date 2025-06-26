import reqValidate from "./utils/validate.js";
import replayVerify from "./utils/replay-verify.js";
import { CS_REGIONS } from "./constants/index.js";
import { WebhookRequestBody } from "./types/index.js";

const verify = (
  headerSignature: string,
  reqBody: WebhookRequestBody,
  region: string = CS_REGIONS[0], // Default to the first region if not provided
) => {
  reqValidate(headerSignature, reqBody, region);
  replayVerify(reqBody.triggered_at);
};

export default verify;
