import { tasks } from "@trigger.dev/sdk";
import { NextResponse } from "next/server";
import type { helloWorldTask } from "@/trigger/example";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const body = await request.json();

  const handle = await tasks.trigger<typeof helloWorldTask>("hello-world", {
    name: body.name ?? "World",
  });

  return NextResponse.json(handle);
}
