import { streams, InferStreamType } from "@trigger.dev/sdk";

/**
 * Typed stream definition for AI text streaming.
 * Used to pipe text chunks from AI completions to the frontend in real-time.
 */
export const aiTextStream = streams.define<string>({
  id: "ai-text",
});

/**
 * Type representing each chunk/part of the AI text stream.
 * Useful for type-safe consumption in React components.
 */
export type AITextStreamPart = InferStreamType<typeof aiTextStream>;
