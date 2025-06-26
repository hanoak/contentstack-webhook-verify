export const CS_REGIONS = [
  "NA",
  "EU",
  "AZZURE-NA",
  "AZZURE-EU",
  "GCP-NA",
  "GCP-EU",
];

export const CS_REGIONS_URLS = {
  NA: "https://app.contentstack.com/.well-known/public-keys.json",
  EU: "https://eu-app.contentstack.com/.well-known/public-keys.json",
  "AZZURE-NA":
    "https://azure-na-app.contentstack.com/.well-known/public-keys.json",
  "AZZURE-EU":
    "https://azure-eu-app.contentstack.com/.well-known/public-keys.json",
  "GCP-NA": "https://gcp-na-app.contentstack.com/.well-known/public-keys.json",
  "GCP-EU": "https://gcp-eu-app.contentstack.com/.well-known/public-keys.json",
};

export const WEBHOOK_THRESHOLD_MINS = 5 * 60; // 5 minutes in seconds

export const WEBHOOK_TIMEOUT = 30 * 1000; // 30 seconds in milliseconds
