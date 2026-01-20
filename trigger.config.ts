import { defineConfig } from "@trigger.dev/sdk";

export default defineConfig({
  // Your project ref (get from Trigger.dev dashboard: https://cloud.trigger.dev)
  project: process.env.TRIGGER_PROJECT_ID!,
  // The paths for your trigger task folders
  dirs: ["./trigger"],
  // Maximum duration for task runs in seconds (1 hour)
  maxDuration: 3600,
  // Retry configuration
  retries: {
    // Enable retries in dev mode (when using the CLI)
    enabledInDev: false,
    // Default retry settings - used if not specified on a task
    default: {
      maxAttempts: 3,
      minTimeoutInMs: 1000,
      maxTimeoutInMs: 10000,
      factor: 2,
      randomize: true,
    },
  },
});
