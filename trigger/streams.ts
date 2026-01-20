import { streams } from "@trigger.dev/sdk";

/**
 * Typed stream definition for AI text responses.
 * This stream is used to pipe AI-generated text from tasks to the frontend in real-time.
 */
export const aiTextStream = streams.define<string>({
  id: "ai-text",
});
