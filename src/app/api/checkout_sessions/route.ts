import { NextRequest, NextResponse } from "next/server";

import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

// {
//   price: "price_1QlgkJAIShzl6ZspKAWyJwNl",
//   quantity: 1,
// },
// {
//   price: "price_1QlgkJAIShzl6ZspbYPwLGEi",
//   quantity: 1,
// },
// {
//   price: "price_1QlgkJAIShzl6Zsp70JtvBHU",
//   quantity: 1,
// },
// {
//   price: "price_1QlgkJAIShzl6ZspoSfAdNTZ",
//   quantity: 1,
// },
// {
//   price: "price_1QlgkJAIShzl6ZspwpLS0Z5l",
//   quantity: 1,
// },
// {
//   price: "price_1QlgkJAIShzl6ZspRQAJ0hGq",
//   quantity: 1,
// },
// {
//   price: "price_1QlgkJAIShzl6ZspW7rYYpyi",
//   quantity: 1,
// },
// {
//   price: "price_1QlgkJAIShzl6ZsptWnN8UBc",
//   quantity: 1,
// },

export async function POST(req: NextRequest) {
  try {
    console.log("process.env.STRIPE_SECRET_KEY", process.env.STRIPE_SECRET_KEY);

    const referer = req.headers.get("referer");
    const locale = referer?.includes("en") ? "en" : "ar";

    // Create Checkout Sessions from body params.
    const session = await stripe.checkout.sessions.create({
      ui_mode: "embedded",
      line_items: [
        {
          price: "price_1QlhbtAIShzl6ZspOBjsjJB3",
          quantity: 1,
        },
      ],
      mode: "payment",
      return_url: `${req.headers.get(
        "origin"
      )}/${locale}/donate/return?session_id={CHECKOUT_SESSION_ID}`,
    });

    return NextResponse.json({ clientSecret: session.client_secret });
  } catch (err: unknown) {
    const error = err as Stripe.StripeRawError;

    console.error("Error creating checkout session for Stripe", error);

    return NextResponse.json(error.message, {
      status: error.statusCode || 500,
    });
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const sessionId = searchParams.get("session_id");

    if (!sessionId) {
      return NextResponse.json("Session ID is required", { status: 400 });
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId);

    return NextResponse.json({
      status: session.status,
      customer_email: session.customer_details?.email,
    });
  } catch (err: unknown) {
    const error = err as Stripe.StripeRawError;
    return NextResponse.json(error.message, {
      status: error.statusCode || 500,
    });
  }
}
