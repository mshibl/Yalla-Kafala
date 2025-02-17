import { NextRequest, NextResponse } from "next/server";

import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: NextRequest) {
  try {
    const reqBody = await req.json();
    const { amount, frequency } = reqBody as {
      amount: keyof typeof PRICE_LIST;
      frequency: "once" | "monthly";
    };

    const referer = req.headers.get("referer");
    const locale = referer?.includes("en") ? "en" : "ar";

    let priceId =
      frequency === "once"
        ? PRICE_LIST[amount]?.once
        : PRICE_LIST[amount]?.monthly;

    if (!priceId) {
      priceId = CUSTOM_AMOUNT_PRICE_ID;
    }

    const mode = frequency === "once" ? "payment" : "subscription";

    // Create Checkout Sessions from body params.
    const session = await stripe.checkout.sessions.create({
      ui_mode: "embedded",
      line_items: [{ price: priceId, quantity: 1 }],
      mode: mode,
      submit_type: "donate",
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

const PRICE_LIST = {
  10: {
    once: "price_1QtNOyAIShzl6ZspZLdolkUG",
    monthly: "price_1QtN5PAIShzl6ZspV6Yy8w9e",
  },
  25: {
    once: "price_1QtN5PAIShzl6ZspwaMqQ2zn",
    monthly: "price_1QtN5PAIShzl6ZsphcgIafbN",
  },
  50: {
    once: "price_1QtN5PAIShzl6ZspHBqP3iYz",
    monthly: "price_1QtN5PAIShzl6ZspWO4sKLxx",
  },
  100: {
    once: "price_1QtN5PAIShzl6Zsp3RSFpUnZ",
    monthly: "price_1QtN5PAIShzl6ZspIHg8nZAe",
  },
  200: {
    once: "price_1QtN5PAIShzl6ZspTN4cg6Ms",
    monthly: "price_1QtN5OAIShzl6ZspobQFFINs",
  },
  400: {
    once: "price_1QtN5PAIShzl6ZspcgaJk4zI",
    monthly: "price_1QtN5OAIShzl6Zspa2Zm56mY",
  },
  800: {
    once: "price_1QtN5PAIShzl6ZspSU8Aq2jP",
    monthly: "price_1QtN5OAIShzl6ZspB64eIfg6",
  },
  1000: {
    once: "price_1QtN5PAIShzl6ZspiW4hoysC",
    monthly: "price_1QtN5OAIShzl6ZspPPqS82aK",
  },
};

const CUSTOM_AMOUNT_PRICE_ID = "price_1QlhbtAIShzl6ZspOBjsjJB3";

// const TEST_PRICE_LIST = {
//   10: {
//     once: "price_1QlgjKAIShzl6ZspskaVHtuI",
//     monthly: "price_1QlgjKAIShzl6Zsp2CYpY3bP",
//   },
//   25: {
//     once: "price_1QlgjKAIShzl6ZspoAFmqGTk",
//     monthly: "price_1QlgjKAIShzl6Zsp4llTKHgH",
//   },
//   50: {
//     once: "price_1QlgjKAIShzl6Zsp5ILtsjgo",
//     monthly: "price_1QlgjKAIShzl6ZspNetmX2FO",
//   },
//   100: {
//     once: "price_1QlgjKAIShzl6ZspxaVwnMVi",
//     monthly: "price_1QlgjKAIShzl6ZspAtaytION",
//   },
//   200: {
//     once: "price_1QtLh2AIShzl6ZspsILSSzXb",
//     monthly: "price_1QtM0zAIShzl6Zspd7oa3GpZ",
//   },
//   400: {
//     once: "price_1QtLhTAIShzl6ZspgygIgHPc",
//     monthly: "price_1QtM1IAIShzl6Zspy3PS4qbK",
//   },
//   800: {
//     once: "price_1QtLhoAIShzl6Zspuf829hjP",
//     monthly: "price_1QtM1WAIShzl6Zspk1MaqCNW",
//   },
//   1000: {
//     once: "price_1QtLiBAIShzl6ZsprtROHvlt",
//     monthly: "price_1QtM1jAIShzl6ZspdtxpDibO",
//   },
// };
