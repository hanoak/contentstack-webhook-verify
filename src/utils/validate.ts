import { CS_REGIONS } from "../constants/index.js";

const reqValidate = (
  headerSignature: string,
  reqBody: object,
  region: string,
) => {
  if (!headerSignature || typeof headerSignature !== "string") {
    throw new Error("Invalid header signature");
  }

  if (!reqBody || typeof reqBody !== "object") {
    throw new Error("Invalid request body");
  }

  if (!region || !CS_REGIONS.includes(region)) {
    throw new Error("Invalid region");
  }
};

export default reqValidate;
