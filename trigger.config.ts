import { defineConfig } from "@trigger.dev/sdk";

export default defineConfig({
  // Your project ref (you can find this in the Trigger.dev dashboard)
  project: process.env.TRIGGER_PROJECT_ID!,
  // The paths for your trigger folders
  dirs: ["./trigger"],
  retries: {
    // If you want to retry a task in dev mode (when using the CLI)
    enabledInDev: false,
    // The default retry settings. Used if you don't specify on a task.
    default: {
      maxAttempts: 3,
      minTimeoutInMs: 1000,
      maxTimeoutInMs: 10000,
      factor: 2,
      randomize: true,
    },
  },
  // Max duration of a task in seconds
  maxDuration: 3600,
});
