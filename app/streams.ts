import { streams, InferStreamType } from "@trigger.dev/sdk";
import type { UIMessageChunk } from "ai";

/**
 * AI Stream definition for streaming UI message chunks from Trigger.dev tasks
 * Used for real-time AI response streaming to the frontend
 */
export const aiStream = streams.define<UIMessageChunk>({
  id: "ai",
});

/**
 * Type for individual stream parts - use this when consuming the stream
 */
export type AIStreamPart = InferStreamType<typeof aiStream>;
