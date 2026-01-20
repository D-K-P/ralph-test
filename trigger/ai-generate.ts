import { task } from "@trigger.dev/sdk";
import { openai } from "@ai-sdk/openai";
import { streamText } from "ai";
import { aiStream } from "@/app/streams";

/**
 * AI Generation Task
 *
 * This task accepts a prompt and streams the AI response back to the frontend
 * using Trigger.dev's realtime streams with the Vercel AI SDK.
 */
export const generateAI = task({
  id: "generate-ai",
  run: async (payload: { prompt: string }) => {
    // Generate streaming text response using OpenAI
    const result = streamText({
      model: openai("gpt-4o-mini"),
      prompt: payload.prompt,
    });

    // Pipe the AI stream to the frontend using Trigger.dev's realtime streams
    // toUIMessageStream() converts the AI SDK stream to UIMessageChunk format
    const { waitUntilComplete } = aiStream.pipe(result.toUIMessageStream());

    // Wait for the stream to complete before returning
    await waitUntilComplete();

    return { success: true };
  },
});
