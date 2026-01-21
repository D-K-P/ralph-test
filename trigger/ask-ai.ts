import { task, logger } from "@trigger.dev/sdk";
import { streamText } from "ai";
import { openai } from "@ai-sdk/openai";
import { aiTextStream } from "./streams";

/**
 * Payload type for the ask-ai task.
 */
export interface AskAIPayload {
  question: string;
}

/**
 * Output type for the ask-ai task.
 */
export interface AskAIOutput {
  answer: string;
}

/**
 * Ask AI task - accepts a question and streams the AI response in real-time.
 * Uses OpenAI's gpt-4o-mini model via the Vercel AI SDK.
 * Streams tokens to the frontend using Trigger.dev Realtime Streams v2.
 */
export const askAI = task({
  id: "ask-ai",
  run: async (payload: AskAIPayload): Promise<AskAIOutput> => {
    logger.info("Starting ask-ai task", { question: payload.question });

    // Generate streaming text response using Vercel AI SDK
    const result = streamText({
      model: openai("gpt-4o-mini"),
      prompt: payload.question,
    });

    // Pipe the text stream to Trigger.dev Realtime Streams for live frontend updates
    const { stream } = aiTextStream.pipe(result.textStream);

    // Collect the full response while streaming
    let fullText = "";
    for await (const chunk of stream) {
      fullText += chunk;
    }

    logger.info("Completed ask-ai task", {
      questionLength: payload.question.length,
      answerLength: fullText.length,
    });

    return { answer: fullText };
  },
});
