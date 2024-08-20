import { adminDb } from "@/firebaseAdmin";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

export async function POST(req: NextRequest) {
  const headersList = headers();
  const body = await req.text();
  const signature = headersList.get("stripe-signature");

  console.log("--- route.ts: Stripe webhook received ---");

  if (!signature) {
    return new Response("Stripe signature header not found", { status: 400 });
  }

  if (!process.env.STRIPE_WEBHOOK_SECRET) {
    console.log("--- route.ts: Stripe webhook secret not found ---");
    return new NextResponse("Stripe webhook secret not found", { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = Stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (error) {
    console.log(`--- route.ts: Webhook error: ${error} ---`, { status: 400 });
    return new NextResponse(`Webhook error: ${error}`, { status: 400 });
  }

  const getUserDetails = async (customerId: string) => {
    const userDoc = await adminDb
      .collection("users")
      .where("stripeCustomerId", "==", customerId)
      .limit(1)
      .get();
    if (!userDoc.empty) {
      return userDoc.docs[0];
    }
  };

  console.log(`--- route.ts: Received event type: ${event.type} ---`);

  switch (event.type) {
    case "checkout.session.completed":
    case "payment_intent.succeeded": {
      const invoice = event.data.object;
      const customerId = invoice.customer as string;

      const userDetails = await getUserDetails(customerId);
      if (!userDetails?.id) {
        console.log("--- route.ts: User not found ---");
        return new NextResponse("User not found", { status: 404 });
      }

      // Update active membership
      await adminDb.collection("users").doc(userDetails?.id).update({
        hasActiveMembership: true,
      });

      break;
    }

    case "customer.subscription.deleted":
    case "subscription_schedule.canceled": {
      const subscription = event.data.object as Stripe.Subscription;
      const cusotmerId = subscription.customer as string;

      const userDetails = await getUserDetails(cusotmerId);
      if (!userDetails?.id) {
        console.log("--- route.ts: User not found ---");
        return new NextResponse("User not found", { status: 404 });
      }

      // set membership flag to false on Db.
      await adminDb.collection("users").doc(userDetails?.id).update({
        hasActiveMembership: false,
      });
      break;
    }

    default:
      console.log(`Unhandled event type: ${event.type}`);
  }

  return  NextResponse.json("Webhook received successfully.", { status: 200 });
}
