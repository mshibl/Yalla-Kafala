import "@/src/app/[locale]/kafala_assistant/kafala-assistant.css";
import { Chat } from "@/src/components/AIAssistant/chat";
import { generateId } from "ai";

export default async function Page() {
  return <Chat id={generateId()} initialMessages={[]} />;
}
