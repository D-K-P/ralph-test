import { tasks, auth } from "@trigger.dev/sdk";
import type { askAI } from "@/trigger/ask-ai";
import { NextResponse } from "next/server";

/**
 * POST /api/ask
 * Triggers the ask-ai task and returns a public access token for realtime streaming.
 *
 * Request body: { question: string }
 * Response: { runId: string, publicAccessToken: string }
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { question } = body;

    if (!question || typeof question !== "string") {
      return NextResponse.json(
        { error: "Question is required and must be a string" },
        { status: 400 }
      );
    }

    // Trigger the ask-ai task with the question payload
    const handle = await tasks.trigger<typeof askAI>("ask-ai", { question });

    // Create a public access token scoped to only this specific run
    // This allows the frontend to subscribe to realtime updates for this run only
    const publicAccessToken = await auth.createPublicToken({
      scopes: {
        read: {
          runs: [handle.id],
        },
      },
    });

    return NextResponse.json({
      runId: handle.id,
      publicAccessToken,
    });
  } catch (error) {
    console.error("Error triggering ask-ai task:", error);
    return NextResponse.json(
      { error: "Failed to trigger task" },
      { status: 500 }
    );
  }
}
