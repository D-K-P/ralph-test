import { task } from "@trigger.dev/sdk";
import { streamText } from "ai";
import { openai } from "@ai-sdk/openai";
import { aiResponseStream } from "./streams";

export const askAI = task({
  id: "ask-ai",
  run: async (payload: { prompt: string }) => {
    const result = streamText({
      model: openai("gpt-4o-mini"),
      prompt: payload.prompt,
    });

    const { waitUntilComplete } = aiResponseStream.pipe(result.toTextStream());

    await waitUntilComplete();

    return { success: true };
  },
});
