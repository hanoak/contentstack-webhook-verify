import { WEBHOOK_THRESHOLD_MINS } from "../constants/index.js";
import WebhookError from "./error.js";

const replayVerify = (triggeredAt: string) => {
  if (!triggeredAt || typeof triggeredAt !== "string") {
    throw new WebhookError(
      "Invalid Payload: 'triggered_at' is required and must be a string",
    );
  }

  if (isNaN(Date.parse(triggeredAt))) {
    throw new WebhookError("Invalid 'triggered_at' format");
  }

  const triggeredAtTimestamp = Math.floor(
    new Date(triggeredAt).getTime() / 1000,
  );
  const nowTimestamp = Math.floor(new Date().getTime() / 1000);

  if (nowTimestamp - triggeredAtTimestamp > WEBHOOK_THRESHOLD_MINS) {
    throw new WebhookError("Expired signature: The webhook is too old");
  }
};

export default replayVerify;
