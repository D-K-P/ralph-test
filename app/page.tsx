"use client";

import { useState, FormEvent } from "react";
import { AskAI } from "./components/AskAI";

/**
 * Main page component for the Ask AI application.
 * Provides a form to submit questions and displays streaming AI responses.
 */
export default function Home() {
  // Form state
  const [question, setQuestion] = useState("");

  // Response state
  const [runId, setRunId] = useState<string | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);

  // UI state
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Handle form submission to trigger the AI task.
   */
  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    // Validate input
    if (!question.trim()) {
      setError("Please enter a question");
      return;
    }

    // Reset state and start loading
    setIsLoading(true);
    setError(null);
    setRunId(null);
    setAccessToken(null);

    try {
      // Call the API to trigger the task
      const response = await fetch("/api/ask", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ question: question.trim() }),
      });

      // Parse the response
      const data = await response.json();

      // Handle API errors
      if (!response.ok) {
        throw new Error(data.error || "Failed to submit question");
      }

      // Store the run ID and access token for streaming
      setRunId(data.runId);
      setAccessToken(data.publicAccessToken);
    } catch (err) {
      // Display error message
      setError(err instanceof Error ? err.message : "An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  }

  /**
   * Reset state to ask another question.
   */
  function handleReset() {
    setQuestion("");
    setRunId(null);
    setAccessToken(null);
    setError(null);
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center gap-8 py-16 px-8 bg-white dark:bg-black">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Ask AI
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Ask a question and get an AI-powered response
          </p>
        </div>

        {/* Show form when no active run */}
        {!runId && (
          <form onSubmit={handleSubmit} className="w-full max-w-xl space-y-4">
            {/* Question input */}
            <div>
              <label
                htmlFor="question"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Your Question
              </label>
              <textarea
                id="question"
                name="question"
                rows={4}
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="What would you like to know?"
                disabled={isLoading}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed resize-none"
              />
            </div>

            {/* Error display */}
            {error && (
              <div className="p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
              </div>
            )}

            {/* Submit button */}
            <button
              type="submit"
              disabled={isLoading || !question.trim()}
              className="w-full py-3 px-6 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed text-white font-medium transition-colors flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" />
                  Submitting...
                </>
              ) : (
                "Ask AI"
              )}
            </button>
          </form>
        )}

        {/* Show streaming response when run is active */}
        {runId && accessToken && (
          <div className="w-full max-w-xl space-y-4">
            {/* Question display */}
            <div className="p-4 rounded-lg bg-gray-100 dark:bg-gray-800">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                Your question:
              </p>
              <p className="text-gray-900 dark:text-white">{question}</p>
            </div>

            {/* AI response */}
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                AI Response:
              </p>
              <AskAI runId={runId} accessToken={accessToken} />
            </div>

            {/* Ask another button */}
            <button
              type="button"
              onClick={handleReset}
              className="w-full py-3 px-6 rounded-lg border border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 font-medium transition-colors"
            >
              Ask Another Question
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
