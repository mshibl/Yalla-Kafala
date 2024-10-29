import { Message } from "ai";
import { Chat } from "@/schema";
import { notFound } from "next/navigation";
import { Chat as PreviewChat } from "@/src/components/AIAssistant/chat";
import { getChatById } from "@/src/app/db";

export default async function Page({ params }: { params: any }) {
  const { id } = params;
  const chatFromDb = await getChatById({ id });

  if (!chatFromDb) {
    notFound();
  }

  // type casting
  const chat: Chat = {
    ...chatFromDb,
    messages: chatFromDb.messages as Message[],
  };

  return <PreviewChat id={chat.id} initialMessages={chat.messages} />;
}
