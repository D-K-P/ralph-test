import { defineConfig } from "@trigger.dev/sdk";

export default defineConfig({
  // Your project ref (found in Trigger.dev dashboard Project settings)
  project: process.env.TRIGGER_PROJECT_REF!,
  // Directory containing your trigger tasks
  dirs: ["./trigger"],
  // Maximum duration for task runs in seconds (required)
  maxDuration: 3600, // 1 hour
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
});
