"use server";

import { adminDb } from "@/firebaseAdmin";
import getBaseUrl from "@/lib/getBaseUrl";
import stripe from "@/lib/stripe";
import { auth } from "@clerk/nextjs/server";

export async function createStripePortal() {
  auth().protect();

  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized user.");
  }

  // get customer ID from firebase
  const user = await adminDb.collection("users").doc(userId).get();
  const stripeCustomerId = user.data()?.stripeCustomerId;

  // check whether customer is valid
  if (!stripeCustomerId) {
    throw new Error("Could not find stripe customer.");
  }

  const session = await stripe.billingPortal.sessions.create({
    customer: stripeCustomerId,
    return_url: `${getBaseUrl()}/dashboard`,
  });

  return session.url;
}
