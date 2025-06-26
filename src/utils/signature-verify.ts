import { WebhookRequestBody } from "../types/index.js";
import crypto from "crypto";
import WebhookError from "./error.js";

/**
 * Verifies the signature of a webhook request using the provided public key.
 *
 * This function extracts the signature from the header, constructs a public key from the given PEM string,
 * and verifies the request body using RSA-PSS with SHA-256. If the verification fails, it throws a `WebhookError`.
 *
 * @param headerSignature - The signature string from the webhook request header (e.g., "sig=...").
 * @param csPublicKey - The Contentstack public key in PEM format used to verify the signature.
 * @param reqBody - The webhook request body to be verified.
 * @throws {WebhookError} If the signature verification fails.
 */
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
    throw new WebhookError("Signature verification failed.");
  }
};

export default verifySignature;
