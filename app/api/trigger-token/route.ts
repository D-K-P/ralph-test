import { auth } from "@trigger.dev/sdk";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    // Create a single-use trigger token for the 'ask-ai' task
    // This token allows the frontend to trigger the task directly
    const triggerToken = await auth.createTriggerPublicToken("ask-ai");

    return NextResponse.json({ token: triggerToken });
  } catch (error) {
    console.error("Failed to create trigger token:", error);

    // Return appropriate error response
    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: "Failed to create trigger token" },
      { status: 500 }
    );
  }
}
