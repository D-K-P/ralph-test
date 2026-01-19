import { defineConfig } from "@trigger.dev/sdk";

export default defineConfig({
  // Your project ref (you can find it on the Project settings page in the dashboard)
  project: process.env.TRIGGER_PROJECT_REF!,
  // The paths for your trigger task folders
  dirs: ["./trigger"],
  // Retry configuration
  retries: {
    // Disable retries in dev mode
    enabledInDev: false,
    // Default retry settings for all tasks
    default: {
      maxAttempts: 3,
      minTimeoutInMs: 1000,
      maxTimeoutInMs: 10000,
      factor: 2,
      randomize: true,
    },
  },
  // Max duration in seconds
  maxDuration: 300,
});
