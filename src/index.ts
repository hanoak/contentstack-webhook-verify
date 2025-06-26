import reqValidate from "./utils/validate.js";
import replayVerify from "./utils/replay-verify.js";
import { CS_REGIONS, CS_REGIONS_URLS } from "./constants/index.js";
import { WebhookRequestBody } from "./types/index.js";
import makeRequest from "./utils/request.js";
import verifySignature from "./utils/signature-verify.js";

const verify = async (
  headerSignature: string,
  reqBody: WebhookRequestBody,
  region: keyof typeof CS_REGIONS_URLS = CS_REGIONS[0] as keyof typeof CS_REGIONS_URLS, // Default to the first region if not provided
): Promise<true | Error> => {
  reqValidate(headerSignature, reqBody, region);
  replayVerify(reqBody.triggered_at);

  const csPublicKey = (await makeRequest(CS_REGIONS_URLS[region]))[
    "signing-key"
  ];

  verifySignature(headerSignature, csPublicKey, reqBody);

  console.info("Signature verified successfully.");
  return true;
};

export default verify;
