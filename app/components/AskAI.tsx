"use client";

import { useRealtimeStream } from "@trigger.dev/react-hooks";
import { aiTextStream } from "@/trigger/streams";

/**
 * Props for the AskAI streaming response component.
 * @param runId - The Trigger.dev run ID to subscribe to
 * @param accessToken - The public access token for authentication
 */
export interface AskAIProps {
  runId: string;
  accessToken: string;
}

/**
 * AskAI component that displays streaming AI responses in real-time.
 * Uses Trigger.dev Realtime Streams v2 to receive text chunks as they are generated.
 */
export function AskAI({ runId, accessToken }: AskAIProps) {
  const { parts, error } = useRealtimeStream(aiTextStream, runId, {
    accessToken,
    timeoutInSeconds: 120,
  });

  // Error state - display error message
  if (error) {
    return (
      <div className="p-4 rounded-lg bg-red-50 border border-red-200">
        <p className="text-red-600 font-medium">Error</p>
        <p className="text-red-500 text-sm mt-1">{error.message}</p>
      </div>
    );
  }

  // Loading state - no parts received yet
  if (!parts) {
    return (
      <div className="p-4 rounded-lg bg-gray-50 border border-gray-200">
        <div className="flex items-center gap-2">
          <div className="animate-spin h-4 w-4 border-2 border-blue-500 border-t-transparent rounded-full" />
          <p className="text-gray-600">Thinking...</p>
        </div>
      </div>
    );
  }

  // Success state - display streamed text
  return (
    <div className="p-4 rounded-lg bg-white border border-gray-200 shadow-sm">
      <div className="prose prose-sm max-w-none">
        <p className="text-gray-800 whitespace-pre-wrap leading-relaxed">
          {parts.join("")}
        </p>
      </div>
      {parts.length === 0 && (
        <p className="text-gray-400 italic">Waiting for response...</p>
      )}
    </div>
  );
}

export default AskAI;
