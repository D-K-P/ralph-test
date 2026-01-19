import { defineConfig } from "@trigger.dev/sdk";

export default defineConfig({
  // Your project ref (from TRIGGER_PROJECT_REF environment variable)
  project: process.env.TRIGGER_PROJECT_REF!,
  // The paths for your trigger folders
  dirs: ["./trigger"],
  // Maximum duration for a task run in seconds
  maxDuration: 300,
  // Retry configuration
  retries: {
    enabledInDev: false,
    default: {
      maxAttempts: 3,
      minTimeoutInMs: 1000,
      maxTimeoutInMs: 10000,
      factor: 2,
      randomize: true,
    },
  },
});
