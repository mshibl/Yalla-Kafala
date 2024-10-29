import { customModel } from "@/src/ai";
import { createMessage } from "@/src/app/db";
import { convertToCoreMessages, streamText } from "ai";
import { auth } from "googleapis/build/src/apis/abusiveexperiencereport";

export async function POST(request: Request) {
  const { id, messages, selectedFilePathnames } = await request.json();

  const result = await streamText({
    model: customModel,
    system:
      "you are a friendly assistant! keep your responses concise and helpful.",
    messages: convertToCoreMessages(messages),
    experimental_providerMetadata: {
      files: {
        selection: selectedFilePathnames,
      },
    },
    onFinish: async ({ text }) => {
      await createMessage({
        id,
        messages: [...messages, { role: "assistant", content: text }],
        author: "Kafala Assistant",
      });
    },
    experimental_telemetry: {
      isEnabled: true,
      functionId: "stream-text",
    },
  });

  return result.toDataStreamResponse({});
}
