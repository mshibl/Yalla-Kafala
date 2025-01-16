import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    // Only process messages
    if (true) {
      const formattedMessage = [{ role: "user", content: "Hi" }];

      // send a request to the chat endpoint
      const messageResponse = await fetch("http://localhost:3000/api/chat", {
        method: "POST",
        body: JSON.stringify({
          id: "123",
          messages: formattedMessage,
          authorName: "test",
          authorMobile: "123",
          blockingResponse: true,
        }),
      });
      const data = await messageResponse.json();
      console.log("data", data.text);
      console.log("messageResponse");
    }

    return new NextResponse("OK", { status: 200 });
  } catch (error) {
    console.error("Error processing webhook:", error);
    return new NextResponse("Error", { status: 500 });
  }
}
