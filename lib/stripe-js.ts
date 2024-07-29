// stripe javascript library...browser/client side environment
import { loadStripe, Stripe } from "@stripe/stripe-js";

let stripePromise: Promise<Stripe | null>;

console.log(
  `Entering stripe-js.ts file....`
);

if (process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY === undefined) {
  throw new Error("STRIPE_PUBLISHABLE_KEY key not found.");
}

const getStripe = (): Promise<Stripe | null> => {
  console.log("--- getStripe called ---");

  if (!stripePromise) {
    stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!); // loads on client side. NextJs allows it to be used.
  }
  return stripePromise;
};

export default getStripe;
