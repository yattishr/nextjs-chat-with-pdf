// server side Stripe
import Stripe from "stripe";

const stripeSecretKey = process.env.STRIPE_API_KEY;

if (!stripeSecretKey) {
  throw new Error("STRIPE_API_KEY is not defined");
}

const stripe = new Stripe(stripeSecretKey);

console.log(`--- Entering stripe.ts..Logging stripe key: ${stripe} ---`)

export default stripe;