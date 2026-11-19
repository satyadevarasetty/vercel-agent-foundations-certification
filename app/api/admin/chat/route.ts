import { adminChatFlow } from "@/lib/workflows/admin-chat-flow";
import { createModelCallToUIChunkTransform } from "@ai-sdk/workflow";
import { createUIMessageStreamResponse, type UIMessage } from "ai";
import { start } from "workflow/api";

export async function POST(request: Request) {
  const { messages } = (await request.json()) as { messages: UIMessage[] };

  const run = await start(adminChatFlow, [messages]);

  const readable = run
    .getReadable({ startIndex: 0 })
    .pipeThrough(createModelCallToUIChunkTransform({ uiStartIndex: 0 }));

  return createUIMessageStreamResponse({
    stream: readable,
    headers: { "x-workflow-run-id": run.runId },
  });
}
