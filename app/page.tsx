"use client";

import { useState, FormEvent } from "react";
import { useRealtimeRunWithStreams } from "@trigger.dev/react-hooks";
import type { askAI, STREAMS } from "@/trigger/ask-ai";

export default function Home() {
  const [question, setQuestion] = useState("");
  const [runId, setRunId] = useState<string | null>(null);
  const [publicAccessToken, setPublicAccessToken] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Subscribe to the run and streams when we have a runId and token
  const { run, streams, error: realtimeError } = useRealtimeRunWithStreams<typeof askAI, STREAMS>(
    runId ?? "",
    {
      accessToken: publicAccessToken ?? "",
      enabled: !!runId && !!publicAccessToken,
    }
  );

  // Get the streamed text from the ai-text stream
  const streamedText = streams?.["ai-text"]?.join("") || "";

  // Determine the current state for UI
  const isLoading = run?.status === "QUEUED" || run?.status === "EXECUTING";
  const isCompleted = run?.status === "COMPLETED";
  const isFailed = run?.status === "FAILED" || run?.status === "CRASHED" || run?.status === "SYSTEM_FAILURE";

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!question.trim()) return;

    setError(null);
    setIsSubmitting(true);
    setRunId(null);
    setPublicAccessToken(null);

    try {
      const response = await fetch("/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: question.trim() }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to submit question");
      }

      const { runId: newRunId, publicAccessToken: token } = await response.json();
      setRunId(newRunId);
      setPublicAccessToken(token);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleReset() {
    setQuestion("");
    setRunId(null);
    setPublicAccessToken(null);
    setError(null);
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center gap-8 py-16 px-8 bg-white dark:bg-black">
        <div className="flex flex-col items-center gap-4 text-center">
          <h1 className="text-3xl font-semibold tracking-tight text-black dark:text-zinc-50">
            Ask AI
          </h1>
          <p className="text-lg text-zinc-600 dark:text-zinc-400">
            Ask a question and get a streamed AI response
          </p>
        </div>

        {/* Question Form */}
        <form onSubmit={handleSubmit} className="w-full max-w-xl flex flex-col gap-4">
          <textarea
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Ask me anything..."
            className="w-full h-32 p-4 text-base border border-zinc-200 dark:border-zinc-800 rounded-lg bg-white dark:bg-zinc-900 text-black dark:text-white placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-400 dark:focus:ring-zinc-600 resize-none"
            disabled={isSubmitting || isLoading}
          />
          <div className="flex gap-3">
            <button
              type="submit"
              disabled={isSubmitting || isLoading || !question.trim()}
              className="flex-1 h-12 rounded-full bg-black dark:bg-white text-white dark:text-black font-medium transition-colors hover:bg-zinc-800 dark:hover:bg-zinc-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Submitting..." : isLoading ? "Thinking..." : "Ask"}
            </button>
            {(runId || error) && (
              <button
                type="button"
                onClick={handleReset}
                className="h-12 px-6 rounded-full border border-zinc-200 dark:border-zinc-800 font-medium transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-900"
              >
                Reset
              </button>
            )}
          </div>
        </form>

        {/* Error Display */}
        {(error || realtimeError) && (
          <div className="w-full max-w-xl p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-red-600 dark:text-red-400">
              {error || realtimeError?.message || "An error occurred"}
            </p>
          </div>
        )}

        {/* Status Indicator */}
        {run && (
          <div className="w-full max-w-xl flex items-center gap-2">
            <div
              className={`w-2 h-2 rounded-full ${
                isLoading
                  ? "bg-yellow-500 animate-pulse"
                  : isCompleted
                  ? "bg-green-500"
                  : isFailed
                  ? "bg-red-500"
                  : "bg-zinc-400"
              }`}
            />
            <span className="text-sm text-zinc-500 dark:text-zinc-400">
              {run.status === "QUEUED" && "Waiting in queue..."}
              {run.status === "EXECUTING" && "AI is thinking..."}
              {run.status === "COMPLETED" && "Complete"}
              {isFailed && "Failed"}
            </span>
          </div>
        )}

        {/* Streamed Response */}
        {(streamedText || isLoading) && (
          <div className="w-full max-w-xl">
            <div className="p-6 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg min-h-[120px]">
              {streamedText ? (
                <p className="text-base leading-relaxed text-zinc-800 dark:text-zinc-200 whitespace-pre-wrap">
                  {streamedText}
                  {isLoading && (
                    <span className="inline-block w-2 h-4 ml-1 bg-zinc-400 animate-pulse" />
                  )}
                </p>
              ) : (
                <div className="flex items-center gap-2 text-zinc-400">
                  <div className="w-2 h-2 rounded-full bg-zinc-400 animate-bounce" />
                  <div className="w-2 h-2 rounded-full bg-zinc-400 animate-bounce [animation-delay:0.1s]" />
                  <div className="w-2 h-2 rounded-full bg-zinc-400 animate-bounce [animation-delay:0.2s]" />
                </div>
              )}
            </div>
          </div>
        )}

        {/* Final Output (when complete) */}
        {isCompleted && run?.output && (
          <div className="w-full max-w-xl text-center">
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              Response complete ({run.output.answer.length} characters)
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
