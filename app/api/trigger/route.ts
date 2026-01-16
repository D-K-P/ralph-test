import { TriggerApi } from "@trigger.dev/sdk";
import { NextRequest, NextResponse } from "next/server";

// Initialize Trigger.dev client with environment variables
const trigger = new TriggerApi({
  id: process.env.TRIGGER_PROJECT_ID!,
  apiKey: process.env.TRIGGER_API_KEY!,
  apiUrl: process.env.TRIGGER_API_URL,
});

// Handle POST requests from Trigger.dev webhooks
export async function POST(request: NextRequest) {
  try {
    // Verify the request is from Trigger.dev using the secret key
    const authHeader = request.headers.get("authorization");
    const expectedAuth = `Bearer ${process.env.TRIGGER_SECRET_KEY}`;

    if (!authHeader || authHeader !== expectedAuth) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Get the webhook payload
    const payload = await request.json();

    // Process the webhook based on the event type
    console.log("Trigger.dev webhook received:", payload);

    // Here you can handle different webhook events
    // For example: job completions, failures, etc.
    switch (payload.type) {
      case "JOB.COMPLETED":
        console.log("Job completed:", payload.data);
        break;
      case "JOB.FAILED":
        console.log("Job failed:", payload.data);
        break;
      default:
        console.log("Unknown webhook type:", payload.type);
    }

    // Return success response
    return NextResponse.json({
      message: "Webhook processed successfully",
      received: true
    });

  } catch (error) {
    console.error("Error processing Trigger.dev webhook:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Export the Trigger.dev client for use in other parts of the application
export { trigger };