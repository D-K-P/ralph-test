import { streams, InferStreamType } from "@trigger.dev/sdk";

export const aiResponseStream = streams.define<string>({
  id: "ai-response",
});

export type AIResponseStreamPart = InferStreamType<typeof aiResponseStream>;
