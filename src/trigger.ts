import { TriggerApi } from "@trigger.dev/sdk";

if (!process.env.TRIGGER_API_KEY) {
  throw new Error("TRIGGER_API_KEY environment variable is required");
}

if (!process.env.TRIGGER_PROJECT_ID) {
  throw new Error("TRIGGER_PROJECT_ID environment variable is required");
}

// Initialize the Trigger.dev client
export const client = new TriggerApi({
  id: process.env.TRIGGER_PROJECT_ID,
  apiKey: process.env.TRIGGER_API_KEY,
  apiUrl: process.env.TRIGGER_API_URL || "https://api.trigger.dev",
});