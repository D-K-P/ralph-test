import { task } from "@trigger.dev/sdk";
import { streamText } from "ai";
import { openai } from "@ai-sdk/openai";
import { aiStream } from "./streams";

// Task payload type
interface AskAIPayload {
  prompt: string;
}

// AI streaming task that uses the cheapest OpenAI model (gpt-4o-mini)
// and streams the response to the frontend using Realtime Streams v2
export const askAI = task({
  id: "ask-ai",
  run: async (payload: AskAIPayload) => {
    const { prompt } = payload;

    // Use streamText from the AI SDK with gpt-4o-mini (cheapest OpenAI model)
    const result = streamText({
      model: openai("gpt-4o-mini"),
      system: "You are a helpful assistant. Provide clear, concise answers.",
      prompt,
    });

    // Pipe the AI response stream to the frontend using Realtime Streams v2
    const { waitUntilComplete } = aiStream.pipe(result.toUIMessageStream());

    // Wait for the stream to complete before the task finishes
    await waitUntilComplete();

    return { success: true };
  },
});
