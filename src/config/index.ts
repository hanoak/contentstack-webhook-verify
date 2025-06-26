import { CS_REGIONS } from "../constants/index.js";
import { Config } from "../types/index.js";

const defaultConfig: Config = {
  replayVerify: true, // Enable replay verification
  replayThreshold: 5 * 60 * 1000, // 5 minutes in milliseconds
  requestTimeout: 30 * 1000, // 30 seconds in milliseconds
  region: CS_REGIONS[0], // Default to the first region
  customRegionUrl: undefined,
};

export default defaultConfig;
