import { defineConfig } from "@trigger.dev/sdk";

export default defineConfig({
  // Project ref from environment variable
  project: process.env.TRIGGER_PROJECT_ID!,
  // Directory containing trigger tasks
  dirs: ["./trigger"],
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
  // Maximum duration for task execution in seconds (required)
  maxDuration: 3600, // 1 hour
});
