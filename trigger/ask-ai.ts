import { task } from "@trigger.dev/sdk";
import { streamText } from "ai";
import { openai } from "@ai-sdk/openai";
import { aiStream } from "./streams";

export const askAiTask = task({
  id: "ask-ai",
  run: async (payload: { prompt: string }) => {
    // Use gpt-4o-mini - the cheapest OpenAI model
    const result = streamText({
      model: openai("gpt-4o-mini"),
      prompt: payload.prompt,
    });

    // Pipe the text stream to the realtime stream
    const { waitUntilComplete } = aiStream.pipe(result.textStream);

    // Wait for the stream to complete before returning
    await waitUntilComplete();

    return { success: true };
  },
});
