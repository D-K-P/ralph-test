"use server";

import { auth } from "@trigger.dev/sdk";

export async function askQuestion(): Promise<{ token: string }> {
  const publicToken = await auth.createTriggerPublicToken("ask-ai");

  return { token: publicToken };
}
