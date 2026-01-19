import { task, streams } from "@trigger.dev/sdk";
import { streamText } from "ai";
import { openai } from "@ai-sdk/openai";
import type { UIMessageChunk } from "ai";

// Define the AI stream for realtime streaming to frontend
export const aiStream = streams.define<UIMessageChunk>({
  id: "ai",
});

// Export the stream type for use in frontend hooks
export type STREAMS = {
  ai: typeof aiStream;
};

export const askAI = task({
  id: "ask-ai",
  run: async (payload: { prompt: string }) => {
    const result = streamText({
      model: openai("gpt-4o-mini"),
      prompt: payload.prompt,
    });

    // Pipe the AI stream to realtime for frontend consumption
    const { waitUntilComplete } = aiStream.pipe(result.toUIMessageStream());

    // Wait for the stream to complete before ending the task
    await waitUntilComplete();

    return { success: true };
  },
});
