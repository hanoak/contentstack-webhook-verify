import WebhookError from "./error.js";
import { Config } from "../types/index.js";

/**
 * Verifies that a webhook event is not a replay by checking the `triggeredAt` timestamp
 * against the current time and a configured replay threshold.
 *
 * @param triggeredAt - The ISO string timestamp indicating when the webhook was triggered.
 * @param options - Configuration options for replay verification, including:
 *   - `replayVerify`: A boolean flag to enable or disable replay verification.
 *   - `replayThreshold`: The maximum allowed age (in milliseconds) for the webhook event.
 * @throws {WebhookError} If `triggeredAt` is missing, not a string, has an invalid format,
 *   or if the webhook event is older than the allowed threshold.
 */
const replayVerify = (triggeredAt: string, options: Config) => {
  if (!options.replayVerify) return;

  if (!triggeredAt || typeof triggeredAt !== "string") {
    throw new WebhookError(
      "Invalid Payload: 'triggered_at' is required and must be a string",
    );
  }

  if (isNaN(Date.parse(triggeredAt))) {
    throw new WebhookError("Invalid 'triggered_at' format");
  }

  const triggeredAtTimestamp = new Date(triggeredAt).getTime();
  const nowTimestamp = new Date().getTime();

  if (nowTimestamp - triggeredAtTimestamp > options.replayThreshold) {
    throw new WebhookError("Expired signature: The webhook is too old");
  }
};

export default replayVerify;
