import { getMessagesByChatId } from "@/src/db";
import { NextResponse } from "next/server";

const WHATSAPP_TOKEN = process.env.WHATSAPP_TOKEN;
const VERIFY_TOKEN = process.env.VERIFY_TOKEN;
const PHONE_NUMBER_ID = process.env.PHONE_NUMBER_ID;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  // Handle the webhook verification challenge
  const mode = searchParams.get("hub.mode");
  const token = searchParams.get("hub.verify_token");
  const challenge = searchParams.get("hub.challenge");

  if (mode === "subscribe" && token === VERIFY_TOKEN) {
    return new NextResponse(challenge, { status: 200 });
  }

  return new NextResponse("Unauthorized", { status: 403 });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Extract the message details
    const entry = body.entry[0];
    const changes = entry.changes[0];
    const value = changes.value;
    console.log("value", JSON.stringify(value, null, 2));

    // Only process messages
    if (value.messages && value.messages.length > 0) {
      const messageContent = value.messages[0];
      const name = value.contacts[0].profile.name;
      const chatId = value.contacts[0].wa_id;
      const from = messageContent.from;
      const messageBody = messageContent.text.body;

      // Fetch old messages in the conversation
      const oldMessages = await getMessagesByChatId({ chatId });

      const fullConversation = [
        ...oldMessages,
        { role: "user", content: messageBody },
      ];

      // send a request to the chat endpoint
      const messageResponse = await fetch(
        "https://www.yallakafala.org/api/chat",
        {
          method: "POST",
          body: JSON.stringify({
            id: chatId,
            messages: fullConversation,
            authorName: name,
            authorMobile: from,
            blockingResponse: true,
          }),
        }
      );
      const data = await messageResponse.json();
      // Send response back
      await sendWhatsAppMessage(from, data.text);
    }

    return new NextResponse("OK", { status: 200 });
  } catch (error) {
    console.error("Error processing webhook:", error);
    return new NextResponse("Error", { status: 500 });
  }
}

// Helper function to send WhatsApp messages
async function sendWhatsAppMessage(to: string, message: string) {
  try {
    const response = await fetch(
      `https://graph.facebook.com/v17.0/${PHONE_NUMBER_ID}/messages`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${WHATSAPP_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messaging_product: "whatsapp",
          to: to,
          type: "text",
          text: { body: message },
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error sending WhatsApp message:", error);
    throw error;
  }
}
