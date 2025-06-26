import WebhookError from "./error.js";
import { Config } from "../types/index.js";

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
