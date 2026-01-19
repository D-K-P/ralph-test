import { auth } from "@trigger.dev/sdk";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const token = await auth.createTriggerPublicToken("ask-ai", {
      multipleUse: true,
    });

    return NextResponse.json({ token });
  } catch (error) {
    console.error("Failed to create trigger token:", error);
    return NextResponse.json(
      { error: "Failed to create trigger token" },
      { status: 500 }
    );
  }
}
