import { streams } from "@trigger.dev/sdk";

// Define the AI stream for streaming text responses
export const aiStream = streams.define<string>({
  id: "ai",
});

// Export STREAMS type for frontend type safety
export type STREAMS = {
  ai: string;
};
