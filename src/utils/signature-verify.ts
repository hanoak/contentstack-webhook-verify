import { WebhookRequestBody } from "../types/index.js";
import crypto from "crypto";

const verifySignature = (
  headerSignature: string,
  csPublicKey: string,
  reqBody: WebhookRequestBody,
) => {
  const signature = headerSignature.split(",")[0].split("=")[1] || "";
  const publicKey = crypto.createPublicKey({
    key: csPublicKey,
    format: "pem",
    type: "pkcs1",
  });

  if (
    !crypto.verify(
      "sha256",
      Buffer.from(JSON.stringify(reqBody)),
      {
        key: publicKey,
        padding: crypto.constants.RSA_PKCS1_PSS_PADDING,
      },
      Buffer.from(signature, "base64"),
    )
  ) {
    throw new Error("Signature verification failed.");
  }
};

export default verifySignature;
