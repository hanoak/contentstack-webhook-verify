import reqValidate from "./utils/validate.js";
import { CS_REGIONS } from "./constants/index.js";

const verify = (
  headerSignature: string,
  reqBody: object,
  region: string = CS_REGIONS[0], // Default to the first region if not provided
) => {
  console.info("headerSignature:", headerSignature);
  console.info("reqBody:", reqBody);
  console.info("region:", region);

  reqValidate(headerSignature, reqBody, region);

  console.info("Request validation passed");
};

export default verify;
