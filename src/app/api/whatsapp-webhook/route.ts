import {
  createChat,
  createMessage,
  createUser,
  getChatByUserId,
  getMessageByWhatsappMessageSid,
  getMessagesByChatId,
  // getUserByPhoneNumber,
  getUserByPhoneNumber,
  getUserByWhatsappWaId,
} from "@/src/db";
import { NextResponse } from "next/server";
import { generateResponse } from "../chat/route";

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
    const buf = await request.arrayBuffer();
    const text = Buffer.from(buf).toString("utf-8");
    const params = new URLSearchParams(text);

    // Read the params
    const body = params.get("Body");
    const from = params.get("From");
    const profileName = params.get("ProfileName");
    const waId = params.get("WaId");
    const smsMessageSid = params.get("SmsMessageSid");
    const numMedia = params.get("NumMedia");
    const messageType = params.get("MessageType");
    const whatsappMessageType = params.get("MessageType");
    const numSegments = params.get("NumSegments");
    const referralNumMedia = params.get("ReferralNumMedia");
    const apiVersion = params.get("ApiVersion");
    // const mediaUrls = params.get("MediaUrls");

    // log all params
    console.debug("[whatsapp-webhook] params", {
      body,
      from,
      profileName,
      waId,
      smsMessageSid,
      numMedia,
      messageType,
      whatsappMessageType,
      numSegments,
      referralNumMedia,
      apiVersion,
    });

    if (!waId) {
      console.error(
        "[whatsapp-webhook] No phone number found in webhook payload"
      );
      return new NextResponse(null, {
        status: 200, // Send a 200 response to WhatsApp to acknowledge the message and avoid retries
      });
    }

    if (!smsMessageSid) {
      console.error(
        "[whatsapp-webhook] No message ID found in webhook payload"
      );
      return new NextResponse(null, {
        status: 200, // Send a 200 response to WhatsApp to acknowledge the message and avoid retries
      });
    }

    // 1. find the user or create a new one
    let user = await getUserByWhatsappWaId({ whatsappWaId: waId });

    if (!user) {
      user = await createUser({
        phone: from?.split(":")[1], // "from" looks like: whatsapp:+14151234567, so we only want the +14151234567
        name: profileName,
        email: "",
        signupMethod: "whatsapp",
        whatsappProfileName: profileName,
        whatsappWaId: waId,
      });
    }

    // 2. find the chat or create a new one
    let chat = await getChatByUserId({ userId: user.id });

    if (!chat) {
      chat = await createChat({ id: user.id, userId: user.id });
    }

    // 3. store the message
    // Check idempotency
    const existingMessage = await getMessageByWhatsappMessageSid({
      whatsappMessageSid: smsMessageSid,
    });

    if (existingMessage) {
      console.error(
        "[whatsapp-webhook] Message already exists",
        existingMessage
      );
      return new NextResponse(null, { status: 200 });
    }

    console.log("createMessage", {
      chatId: chat.id,
      role: "user",
      content: body ?? "<Empty Message>",
      authorName: profileName,
      authorMobile: from,
      whatsappMessageSid: smsMessageSid,
      whatsappAccountSid: apiVersion,
      whatsappMessagingServiceSid: PHONE_NUMBER_ID,
      whatsappMessageType: whatsappMessageType,
      whatsappNumMedia: numMedia,
      whatsappNumSegments: numSegments,
      whatsappReferralNumMedia: referralNumMedia,
      whatsappApiVersion: apiVersion,
    });

    const message = await createMessage({
      chatId: chat.id,
      role: "user",
      content: body ?? "<Empty Message>",
      authorName: profileName,
      authorMobile: from,
      whatsappMessageSid: smsMessageSid,
      whatsappAccountSid: apiVersion,
      whatsappMessagingServiceSid: PHONE_NUMBER_ID,
      whatsappMessageType: whatsappMessageType,
      whatsappNumMedia: numMedia,
      whatsappNumSegments: numSegments,
      whatsappReferralNumMedia: referralNumMedia,
      whatsappApiVersion: apiVersion,
    });

    console.log("message", message);

    // check if the message is not a text message
    // we only support text messages for now
    if (messageType !== "text") {
      console.error(
        "[whatsapp-webhook] Message is not a text message",
        message
      );
      return new NextResponse(
        "Thanks for reaching out! 😊 At the moment, we only support text messages, but feel free to send us your questions here, and we’ll be happy to help!",
        {
          status: 200,
        }
      );
    }

    // 4. generate a response
    const oldMessages = await getMessagesByChatId({ chatId: chat.id });

    const fullConversation = [...oldMessages, message];

    // send a request to the chat endpoint
    // const messageResponse = await fetch(
    //   "https://www.yallakafala.org/api/chat",
    //   {
    //     method: "POST",
    //     body: JSON.stringify({
    //       id: chat.id,
    //       messages: fullConversation,
    //       authorName: user.name,
    //       authorMobile: from,
    //       blockingResponse: true,
    //       isWhatsappMessage: true,
    //     }),
    //   }
    // );

    const messageResponse = await generateResponse({
      id: chat.id,
      messages: fullConversation,
      authorName: user.name,
      authorMobile: from,
      blockingResponse: true,
      isWhatsappMessage: true,
    });

    const data = await messageResponse.json();

    console.debug(
      "[whatsapp-webhook] generated response data",
      JSON.stringify(data, null, 2)
    );

    // 5. send a response
    return new NextResponse(data.text, { status: 200 });
  } catch (error) {
    console.error("[whatsapp-webhook] Error processing webhook:", error);
    return new NextResponse("Error Encountered", { status: 200 });
  }

  // try {
  //   // Read request from Twilio

  //   // Extract the message details
  //   const body = await request.json();

  //   // Extract the message details
  //   const entry = body.entry[0];
  //   const changes = entry.changes[0];
  //   const value = changes.value;
  //   console.log("value", JSON.stringify(value, null, 2));

  //   // Only process messages
  //   if (value.messages && value.messages.length > 0) {
  //     const messageContent = value.messages[0];
  //     const name = value.contacts[0].profile.name;
  //     const chatId = value.contacts[0].wa_id;
  //     const from = messageContent.from;
  //     const messageBody = messageContent.text.body;

  //     // Fetch old messages in the conversation
  //     const oldMessages = await getMessagesByChatId({ chatId });

  //     const fullConversation = [
  //       ...oldMessages,
  //       { role: "user", content: messageBody },
  //     ];

  //     // send a request to the chat endpoint
  //     const messageResponse = await fetch(
  //       "https://www.yallakafala.org/api/chat",
  //       {
  //         method: "POST",
  //         body: JSON.stringify({
  //           id: chatId,
  //           messages: fullConversation,
  //           authorName: name,
  //           authorMobile: from,
  //           blockingResponse: true,
  //         }),
  //       }
  //     );
  //     const data = await messageResponse.json();
  //     // Send response back
  //     await sendWhatsAppMessage(from, data.text);
  //   }

  //   return new NextResponse("OK", { status: 200 });
  // } catch (error) {
  //   console.error("Error processing webhook:", error);
  //   return new NextResponse("Error", { status: 500 });
  // }
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
