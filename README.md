# Contentstack webhook verifier

## Overview

The `contentstack-webhook-verify` is a comprehensive webhook verification utility that authenticates incoming webhook requests through a multi-step security process:

1. **Request Validation** - Validates the header signature, request body, and configuration options
2. **Replay Attack Prevention** - Checks the timestamp to ensure the request isn't a replay of an old request
3. **Signature Verification** - Fetches the public signing key from Contentstack and verifies the webhook signature against it
4. **Error Handling** - Provides structured error reporting through custom `WebhookError` exceptions

The `verify` function returns `true` if all verification steps pass, or throws a `WebhookError` if any step fails. This ensures that only legitimate webhook requests from Contentstack are processed, protecting against common security vulnerabilities like replay attacks and signature forgery.

The function is designed to be flexible with configurable options while maintaining strong security defaults.

## Core Features

### 1. Webhook Signature Verification

- Validates the authenticity of incoming webhook requests by verifying cryptographic signatures
- Fetches the public signing key from Contentstack's servers to ensure the webhook actually came from Contentstack
- Prevents malicious actors from sending fake webhook requests

### 2. Replay Attack Prevention

- Checks the timestamp (`body.triggered_at`) in webhook requests to detect and prevent replay attacks
- Ensures that old webhook requests cannot be reused by attackers
- Configurable time window for acceptable request age

### 3. Request Validation

- Validates the structure and content of incoming webhook requests
- Ensures required fields are present and properly formatted
- Validates header signatures and request body integrity

### 4. Structured Error Handling

- Custom `WebhookError` class for consistent error reporting
- Detailed error messages to help debug verification failures
- Proper error propagation and handling throughout the verification process

### 5. Contentstack multi-region support

- Supports all Contentstack regions: `NA` `EU` `AU` `AZZURE-NA` `AZZURE-EU` `GCP-NA` `GCP-EU`

## Configuration Features

### 1. Flexible Configuration Options

- Configurable verification parameters through `ConfigOptions`
- Default configuration with ability to override specific settings
- Supports customization of security thresholds and validation rules

### 2. HTTP Request Management

- Built-in HTTP client for fetching Contentstack's public keys
- Handles network requests to Contentstack's API endpoints

## Development Features

### 1. TypeScript Support

- Full TypeScript implementation with comprehensive type definitions
- Type-safe interfaces for webhook request bodies and configuration options
- Exported type definitions for integration into TypeScript projects

### 2. Modern ES Module Support

- Built as an ES module for modern JavaScript environments
- Compatible with modern bundlers and Node.js module systems
- Clean import/export structure

### 3. Developer-Friendly API

- Simple, async function that returns `true` on success or throws errors
- Clear function signature with intuitive parameter names
- Comprehensive JSDoc documentation

### 4. Professional Build Pipeline

- TypeScript compilation to JavaScript with type declarations
- ESLint integration for code quality enforcement
- Prettier for consistent code formatting
- Husky pre-commit hooks for quality assurance
- Lintstaged for automatic adding the stage files in git.

### 5. Package Distribution

- Pre-built distribution files in dist directory
- Proper package.json configuration for npm publishing
- MIT license for open-source usage

## Installation

You can install `contentstack-webhook-verify` using:

```text
npm install contentstack-webhook-verify
# or
yarn add contentstack-webhook-verify
```

## Usage Examples

### Basic Usage (Express.js)

```javascript
import express from "express";
import verify from "contentstack-webhook-verify";

const app = express();
app.use(express.json());

app.post("/webhook", async (req, res) => {
  try {
    // Get signature from header
    const signature = req.headers["x-contentstack-request-signature"];

    // Verify the webhook
    const isValid = await verify(signature, req.body);

    if (isValid) {
      console.log("Webhook verified successfully!");
      // Process your webhook data here
      res.status(200).send("Webhook processed");
    }
  } catch (error) {
    console.error("Webhook verification failed:", error.message);
    res.status(401).send("Unauthorized");
  }
});
```

### Next.js API Route Example

```javascript
// pages/api/webhook.js or app/api/webhook/route.js
import verify from "contentstack-webhook-verify";

export async function POST(request) {
  try {
    const signature = request.headers.get("x-contentstack-request-signature");
    const body = await request.json();

    await verify(signature, body);

    // Process webhook payload
    console.log("Content updated:", body.data);

    return new Response("OK", { status: 200 });
  } catch (error) {
    return new Response("Unauthorized", { status: 401 });
  }
}
```

### Typescript usage

```typescript
import verify from "contentstack-webhook-verify";
import type {
  WebhookRequestBody,
  ConfigOptions,
} from "contentstack-webhook-verify";

interface ContentstackWebhookBody extends WebhookRequestBody {
  event_type: string;
  data: {
    entry: {
      uid: string;
      title: string;
      url: string;
    };
  };
}

const config: ConfigOptions = {
  region: "EU",
  replayThreshold: 10 * 60 * 1000,
};

app.post("/webhook", async (req: Request, res: Response) => {
  try {
    const signature = req.headers["x-contentstack-request-signature"] as string;
    const body = req.body as ContentstackWebhookBody;

    await verify(signature, body, config);

    // TypeScript will now provide intellisense for the body structure
    console.log(
      `Processing ${body.event_type} for entry: ${body.data.entry.title}`,
    );

    res.status(200).send("OK");
  } catch (error) {
    res.status(401).send("Unauthorized");
  }
});
```

### Custom Configuration Options

```javascript
import verify from "contentstack-webhook-verify";

const customOptions = {
  replayVerify: true, // Enable replay attack prevention
  replayThreshold: 10 * 60 * 1000, // 10 minutes instead of default 5
  requestTimeout: 15 * 1000, // 15 seconds timeout
  region: "EU", // Use EU region
};

app.post("/webhook", async (req, res) => {
  try {
    const signature = req.headers["x-contentstack-request-signature"];
    await verify(signature, req.body, customOptions);

    // Handle successful verification
    res.status(200).send("Success");
  } catch (error) {
    res.status(401).send(error.message);
  }
});
```

### Different Contentstack Regions

```javascript
// For different Contentstack regions
const customOptions = {
  region: "NA", // Use AWS North America region
  // region: 'EU',                 // Use AWS Europe region
  // region: 'AU',                 // Use AWS Australia region
  // region: 'AZZURE-NA',          // Use AZZURE-NA region
  // region: 'AZZURE-EU',          // Use AZZURE-EU region
  // region: 'GCP-NA',             // Use GCP-NA region
  // region: 'GCP-EU',             // Use GCP-EU region
};

// Use specific region
await verify(signature, requestBody, customOptions);
```

### Custom Region URL

```javascript
const customRegionConfig = {
  customRegionUrl:
    "https://your-custom-contentstack-instance.com/.well-known/public-keys.json",
};

await verify(signature, requestBody, customRegionConfig);
```

### Disable Replay Verification

```javascript
const noReplayCheck = {
  replayVerify: false, // Disable replay attack prevention
};

await verify(signature, requestBody, noReplayCheck);
```

### AWS Lambda Example

```javascript
import verify from "contentstack-webhook-verify";

export const handler = async (event) => {
  try {
    const signature = event.headers["X-Contentstack-Request-Signature"];
    const body = JSON.parse(event.body);

    await verify(signature, body);

    // Process webhook
    console.log("Webhook verified and processed");

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Success" }),
    };
  } catch (error) {
    return {
      statusCode: 401,
      body: JSON.stringify({ error: "Unauthorized" }),
    };
  }
};
```

### WebhookError Handling

The library throws `WebhookError` instances for all verification failures:

```javascript
import verify, { WebhookError } from "contentstack-webhook-verify";

try {
  await verify(signature, body);
} catch (error) {
  if (error instanceof WebhookError) {
    console.error("Webhook verification failed:", error.message);
    // Handle specific webhook errors
  } else {
    console.error("Unexpected error:", error);
    // Handle other errors
  }
}
```

## API Reference

### Main Function

#### `verify(headerSignature, reqBody, options?)`

Verifies the authenticity of a Contentstack webhook request.

**Parameters:**

| Parameter         | Type                 | Required | Description                                             |
| ----------------- | -------------------- | -------- | ------------------------------------------------------- |
| `headerSignature` | `string`             | ✅       | Signature from `x-contentstack-request-signature`header |
| `reqBody`         | `WebhookRequestBody` | ✅       | The webhook request body                                |
| `options`         | `ConfigOptions`      | ❌       | Configuration options (optional)                        |

**Returns:**

- `Promise<true>` - Resolves to `true` when verification succeeds
- `throws WebhookError` - When verification fails

**Throws:**
`WebhookError` - If the request is invalid, the signature is incorrect, or a replay attack is detected

### Types

#### `WebhookRequestBody`

Interface representing the structure of a Contentstack webhook request body.

```javascript
interface WebhookRequestBody {
  triggered_at: string;  // ISO timestamp when the webhook was triggered
  [key: string]: unknown; // Additional webhook payload data
}
```

**Properties:**

| Property        | Type      | Required | Description                                                  |
| --------------- | --------- | -------- | ------------------------------------------------------------ |
| `triggered_at`  | `string`  | ✅       | ISO 8601 timestamp indicating when the webhook was triggered |
| `[key: string]` | `unknown` | ❌       | Rest of the webhook request body                             |

#### `ConfigOptions`

Partial configuration object for customizing webhook verification behavior.

```javascript
type ConfigOptions = Partial<Config>;
```

#### `Config`

Complete configuration interface with all available options.

```javascript
interface Config {
  replayVerify: boolean;
  replayThreshold: number;
  requestTimeout: number;
  region: string;
  customRegionUrl: string | undefined;
}
```

**Properties:**

| Property          | Type      | Default     | Description                                                                 |
| ----------------- | --------- | ----------- | --------------------------------------------------------------------------- |
| `replayVerify`    | `boolean` | `true`      | Enable/disable replay attack prevention                                     |
| `replayThreshold` | `number`  | `300000`    | Time window in milliseconds for acceptable request age (default: 5 minutes) |
| `requestTimeout`  | `number`  | `30000`     | HTTP request timeout in milliseconds (default: 30 seconds)                  |
| `region`          | `string`  | `NA`        | Contentstack region identifier                                              |
| `customRegionUrl` | `string`  | `undefined` | Custom URL for fetching public keys                                         |

#### `RegionKey`

Union type of supported Contentstack regions.

```javascript
type RegionKey = "NA" | "EU" | "AU" | "AZZURE-NA" | "AZZURE-EU" | "GCP-NA" | "GCP-EU";
```

**Supported Regions:**

| Region      | Description                |
| ----------- | -------------------------- |
| `NA`        | AWS North America          |
| `EU`        | AWS Europe                 |
| `AU`        | AWS Australia              |
| `AZZURE-NA` | Azure North America        |
| `AZZURE-EU` | Azure Europe               |
| `GCP-NA`    | Google Cloud North America |
| `GCP-EU`    | Google Cloud Europe        |

#### `WebhookError`

Custom error class for webhook-related errors that extends the built-in `Error` class.

```javascript
class WebhookError extends Error {
  constructor(message: string)
}
```

**Properties:**

| Property  | Type     | Description                          |
| --------- | -------- | ------------------------------------ |
| `message` | `string` | Error message describing the failure |
| `name`    | `string` | Error name (always "WebhookError")   |
| `stack`   | `string` | Stack trace for debugging            |

### Common Error Scenarios

The function will throw `WebhookError` in these cases:

- **Invalid Signature**: Signature doesn't match computed value
- **Replay Attack**: Request timestamp outside acceptable threshold
- **Missing Fields**: Required parameters are missing or invalid
- **Network Error**: Unable to fetch Contentstack's public keys
- **Malformed Request**: Invalid request body structure

## Best Practices

1. **Always handle errors** when calling the verify function
2. **Use HTTPS** for webhook endpoints in production
3. **Log verification failures** for monitoring and debugging
4. **Choose appropriate regions** based on your Contentstack instance
5. **Consider replay thresholds** based on your use case
6. **Implement proper error responses** for failed verifications

## Troubleshooting

### Common Issues

**❌ "Invalid signature" errors:**

- Verify you're using the correct header name. Contentstack sends `X-Contentstack-Request-Signature`(pascal case). However, In Express.js & Next.js, the default behavior is `x-contentstack-request-signature`(all lower-cased). So, depending upon your implementation, make sure the name of this header to be correct.
- Ensure the request body hasn't been modified
- Check if you're using the correct Contentstack region

**❌ "Replay attack detected" errors:**

- Check if your server's clock is synchronized
- Consider increasing `replayThreshold` if needed
- Verify the `triggered_at` timestamp format

**❌ Network timeout errors:**

- Increase `requestTimeout` value
- Check network connectivity to Contentstack's public key endpoints
- Verify firewall settings allow outbound HTTPS requests

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request. Before contributing, please go through the [CONTRIBUTING.md](https://github.com/hanoak/contentstack-webhook-verify/blob/main/CONTRIBUTING.md) file for guidelines and instructions for setting up the development environment and contributing to the project.

## License

This project is licensed under the MIT License - see the [LICENSE](https://github.com/hanoak/contentstack-webhook-verify/blob/main/LICENSE) file for details.

## Support

If you encounter any issues or have questions:

1. Check the [Issues](https://github.com/hanoak/contentstack-webhook-verify/issues) page
2. Create a new issue with detailed information
3. Include error messages and relevant code snippets

---

Thanks,
cheers!
