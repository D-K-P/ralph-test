import { task } from "@trigger.dev/sdk";
import { streamText } from "ai";
import { openai } from "@ai-sdk/openai";
import { aiTextStream } from "./streams";

/**
 * Payload for the ask-ai task
 */
export interface AskAIPayload {
  question: string;
}

/**
 * Response from the ask-ai task
 */
export interface AskAIResponse {
  answer: string;
}

/**
 * Task that answers questions using OpenAI's gpt-4o-mini model.
 * Streams the response in real-time via Trigger.dev Realtime Streams v2.
 */
export const askAI = task({
  id: "ask-ai",
  run: async (payload: AskAIPayload): Promise<AskAIResponse> => {
    // Use streamText from AI SDK with OpenAI's cheapest model
    const result = streamText({
      model: openai("gpt-4o-mini"),
      prompt: payload.question,
    });

    // Pipe the text stream through Trigger.dev's realtime stream
    // This makes the stream available to frontend consumers
    const { stream } = aiTextStream.pipe(result.textStream);

    // Collect the full response while streaming
    let fullText = "";
    for await (const chunk of stream) {
      fullText += chunk;
    }

    return { answer: fullText };
  },
});

/**
 * Type definition for streams exported by this task.
 * Used by frontend hooks for type-safe stream consumption.
 */
export type STREAMS = {
  "ai-text": string;
};
