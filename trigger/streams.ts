import { streams, type InferStreamType } from "@trigger.dev/sdk";
import type { UIMessageChunk } from "ai";

// Stream for AI UI message chunks - used for streaming AI responses to the frontend
export const aiStream = streams.define<UIMessageChunk>({
  id: "ai",
});

// Export the stream type for use in frontend components
export type AIStreamType = InferStreamType<typeof aiStream>;
