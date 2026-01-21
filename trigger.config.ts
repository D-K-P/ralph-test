import { defineConfig } from "@trigger.dev/sdk";

export default defineConfig({
  // Your project ref (replace with your proj_xxx from the Trigger.dev dashboard)
  // Find it at: https://cloud.trigger.dev -> Your Project -> Project Settings
  project: "<your-project-ref>",

  // The paths for your trigger task files
  dirs: ["./trigger"],

  // Retry configuration
  retries: {
    // Disable retries in dev mode for faster debugging
    enabledInDev: false,
    // Default retry settings for production
    default: {
      maxAttempts: 3,
      minTimeoutInMs: 1000,
      maxTimeoutInMs: 10000,
      factor: 2,
      randomize: true,
    },
  },

  // Maximum duration for task execution in seconds (required)
  // Tasks exceeding this duration will be automatically stopped
  maxDuration: 3600, // 1 hour
});
