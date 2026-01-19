import { streams } from "@trigger.dev/sdk";

// Define a typed stream for AI responses
// This stream will carry string chunks from the AI model
export const aiStream = streams.define<string>({
  id: "ai",
});

// Export the STREAMS type for use in frontend components with useRealtimeTaskTriggerWithStreams
export type STREAMS = {
  ai: string;
};
