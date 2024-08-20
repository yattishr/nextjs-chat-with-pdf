"use client";

import { createCheckoutSession } from "@/actions/createCheckoutSession";
import { createStripePortal } from "@/actions/createStripePortal";
import { Button } from "@/components/ui/button";
import useSubscription from "@/hooks/useSubscription";
import getStripe from "@/lib/stripe-js";
import { useUser } from "@clerk/nextjs";
import { CheckCheckIcon, CheckIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";

export type UserDetails = {
  email: string;
  name: string;
};

function PricingPage() {
  const { user } = useUser();
  const router = useRouter();
  const { hasActiveMembership, loading } = useSubscription();
  const [isPending, startTransition] = useTransition();

  console.log(
    `Logging hasActiveMembership from Upgrade page: ${hasActiveMembership}`
  );

  const handleUpgrade = () => {
    if (!user) return;

    const userDetails: UserDetails = {
      email: user.primaryEmailAddress?.toString()!,
      name: user.fullName!,
    };

    console.log(
      `Logging userDetails: ${JSON.stringify(userDetails)} from PricingPage`
    );

    startTransition(async () => {
      console.log("--- Entering startTransition from PricingPage ---");

      const stripe = await getStripe();
      console.log(`Logging stripe: ${JSON.stringify(stripe)} from PricingPage`);

      if (hasActiveMembership) {
        // create stripe portal.......
        const stripePortalUrl = await createStripePortal();
        return router.push(stripePortalUrl)
      }

      // create a Stripe session.
      const sessionId = await createCheckoutSession(userDetails);
      console.log(`Logging sessionId: ${sessionId} from PricingPage`);

      // redirect to the Stripe checkout screen.
      console.log(`--- Redirecting to Checkout Page....from PricingPage ---`);
      await stripe?.redirectToCheckout({
        sessionId,
      });
    });
  };

  const handleUpgradeProPlus = () => {
    if (!user) return;

    const userDetails: UserDetails = {
      email: user.primaryEmailAddress?.toString()!,
      name: user.fullName!,
    };

    console.log(
      `Logging userDetails: ${JSON.stringify(userDetails)} from PricingPage`
    );
  };

  return (
    <div>
      <div className="py-24 sm:py-32">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-base font-semibold leading-7 text-indigo-600">
            Pricing
          </h2>
          <p className="mt-2 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            Supercharge your Document Companion
          </p>
        </div>
        <p className="mx-auto mt-6 max-w-2xl px-10 text-center text-lg leading-8 text-gray-600">
          Choose an affordable plan thats packed with the best features for
          interacting with your PDFs, enhancing productivity, and streamlining
          your workflow.
        </p>

        {/* Pricing Cards */}
        <div className="max-w-md mx-auto mt-10 grid grid-cols-1 md:grid-cols-3 md:max-w-3xl gap-8 lg:max-w-4xl">
          {/* FREE Tier */}
          <div className="ring-1 ring-purple-600 rounded-3xl p-8 h-fit pb-12">
            <h3 className="text-lg font-semibold leading-8 text-gray-900">
              Starter Plan
            </h3>
            <p className="mt-4 text-sm leading-6 text-gray-600">
              Explore Core Features at NO Cost
            </p>
            <p className="mt-6 flex items-baseline gap-x-1">
              <span className="text-4xl font-bold tracking-tight text-gray-900">
                FREE
              </span>
            </p>

            <ul
              role="list"
              className="mt-8 space-y-3 text-sm leading-6 text-gray-600"
            >
              <li className="flex gap-x-3">
                <CheckIcon className="h-6 w-5 flex-none text-white text-xs font-semibold bg-green-500 rounded-full" />{" "}
                2 Documents
              </li>
              <li className="flex gap-x-3">
                <CheckIcon className="h-6 w-5 flex-none text-white text-xs font-semibold bg-green-500 rounded-full" />{" "}
                Up to 3 messages per document
              </li>
              <li className="flex gap-x-3">
                <CheckIcon className="h-6 w-5 flex-none text-white text-xs font-semibold bg-green-500 rounded-full" />{" "}
                Try out the AI chat functionality
              </li>
            </ul>
          </div>

          {/* PRO Tier */}
          <div className="ring-2 ring-indigo-600 rounded-3xl p-8">
            <h3 className="text-lg font-semibold leading-8 text-indigo-600">
              PRO Plan
            </h3>
            <p className="mt-4 text-sm leading-6 text-gray-600">
              Maximise productivity with PRO Features
            </p>
            <p className="mt-6 flex items-baseline gap-x-1">
              <span className="text-4xl font-bold tracking-tight text-gray-900">
                $5.99
              </span>
              <span className="text-sm font-semi-bold leading-6 text-gray-600">
                per month
              </span>
            </p>

            <Button
              className="
              bg-indigo-600 
              w-full 
              text-white shadow-sm 
              hover:bg-indigo-500 
              mt-6 
              rounded-md 
              px-3 py-2 
              text-center text-sm 
              font-semibold 
              leading-6 
              focus-visible:outline 
              focus-visible:outline-2 
              focus-visible:outline-offset-2 
              focus-visible:outline-indigo-600"
              disabled={loading || isPending}
              onClick={handleUpgrade}
            >
              {isPending || loading
                ? "Loading..."
                : hasActiveMembership
                ? "Manage Plan"
                : "Upgrade to PRO"}
            </Button>

            <ul
              role="list"
              className="mt-8 space-y-3 text-sm leading-6 text-gray-600"
            >
              <li className="flex gap-x-3">
                <CheckIcon className="h-6 w-5 flex-none text-white text-xs font-semibold bg-green-500 rounded-full" />{" "}
                Store up to 200 Documents
              </li>
              <li className="flex gap-x-3">
                <CheckIcon className="h-6 w-5 flex-none text-white text-xs font-semibold bg-green-500 rounded-full" />{" "}
                Ability to Delete Documents document
              </li>
              <li className="flex gap-x-3">
                <CheckIcon className="h-6 w-5 flex-none text-white text-xs font-semibold bg-green-500 rounded-full" />{" "}
                Up to 100 messages per document
              </li>

              <li className="flex gap-x-3">
                <CheckIcon className="h-6 w-5 flex-none text-white text-xs font-semibold bg-green-500 rounded-full" />{" "}
                Full Power AI Chat functionality with memory recall
              </li>
              <li className="flex gap-x-3">
                <CheckIcon className="h-6 w-5 flex-none text-white text-xs font-semibold bg-green-500 rounded-full" />{" "}
                Advanced Analytics document
              </li>
              <li className="flex gap-x-3">
                <CheckIcon className="h-6 w-5 flex-none text-white text-xs font-semibold bg-green-500 rounded-full" />{" "}
                24-hour support response time
              </li>
            </ul>
          </div>

          {/* PRO Plus Tier */}
          <div className="ring-1 ring-purple-600 rounded-3xl p-8 h-fit pb-12">
            <h3 className="text-lg font-semibold leading-8 text-gray-900">
              PRO Plus
            </h3>
            <p className="mt-4 text-sm leading-6 text-gray-600">
              Maximise productivity. Get PRO Features AND More!!
            </p>
            <p className="mt-6 flex items-baseline gap-x-1">
              <span className="text-4xl font-bold tracking-tight text-gray-900">
                $11.99
              </span>
              <span className="text-sm font-semi-bold leading-6 text-gray-600">
                per month
              </span>
            </p>

            <Button
              className="
              bg-indigo-600 
              w-full 
              text-white shadow-sm 
              hover:bg-indigo-500 
              mt-6 
              rounded-md 
              px-3 py-2 
              text-center text-sm 
              font-semibold 
              leading-6 
              focus-visible:outline 
              focus-visible:outline-2 
              focus-visible:outline-offset-2 
              focus-visible:outline-indigo-600"
              disabled={true}
              onClick={handleUpgradeProPlus}
            >Upgrade to Pro PLUS</Button>

            <ul
              role="list"
              className="mt-8 space-y-3 text-sm leading-6 text-gray-600"
            >
              <li className="flex gap-x-3">
                <CheckIcon className="h-6 w-5 flex-none text-white text-xs font-semibold bg-green-500 rounded-full" />{" "}
                2 Documents
              </li>
              <li className="flex gap-x-3">
                <CheckIcon className="h-6 w-5 flex-none text-white text-xs font-semibold bg-green-500 rounded-full" />{" "}
                Up to 3 messages per document
              </li>
              <li className="flex gap-x-3">
                <CheckIcon className="h-6 w-5 flex-none text-white text-xs font-semibold bg-green-500 rounded-full" />{" "}
                Try out the AI chat functionality
              </li>
            </ul>
          </div>
          {/* PRO Plus Tier */}
        </div>
      </div>
    </div>
  );
}

export default PricingPage;
