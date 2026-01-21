import { auth } from "@trigger.dev/sdk";
import { askAI } from "@/trigger/ask-ai";

/**
 * POST /api/ask
 *
 * Triggers the ask-ai task and returns a run ID and public access token
 * for the client to subscribe to real-time updates.
 */
export async function POST(req: Request) {
  try {
    // Parse the request body
    const { question } = await req.json();

    // Validate the question
    if (!question || typeof question !== "string") {
      return Response.json(
        { error: "Missing or invalid 'question' in request body" },
        { status: 400 }
      );
    }

    // Trigger the ask-ai task with the question payload
    const run = await askAI.trigger({ question });

    // Generate a scoped public access token that only allows reading this specific run
    // This ensures the client can only access their own run's data
    const publicAccessToken = await auth.createPublicToken({
      scopes: {
        read: {
          runs: [run.id],
        },
      },
    });

    // Return the run ID and token for the client to subscribe to updates
    return Response.json({
      runId: run.id,
      publicAccessToken,
    });
  } catch (error) {
    console.error("Error triggering ask-ai task:", error);
    return Response.json(
      { error: "Failed to trigger task" },
      { status: 500 }
    );
  }
}

// Force dynamic rendering to ensure environment variables are read at runtime
export const dynamic = "force-dynamic";
