'use server'

import { UserDetails } from "@/app/dashboard/upgrade/page";
import { adminDb } from "@/firebaseAdmin";
import getBaseUrl from "@/lib/getBaseUrl";
import stripe from "@/lib/stripe";
import { auth } from "@clerk/nextjs/server";

export async function createCheckoutSession(userDetails: UserDetails) {
    // auth().protect(); OR

    const { userId } = await auth();
    if (!userId) {
        throw new Error("Unauthorized access or User not found.");
    }

    // first check if the user already has a stripeCustomerId
    let stripeCustomerId;

    const user = await adminDb.collection("users").doc(userId).get();
    stripeCustomerId = user.data()?.stripeCustomerId;

    // create new customer on Stripe if none exists.
    if (!stripeCustomerId) {
        // create a new customer...server side
        const customer = await stripe.customers.create({
            email: userDetails.email,
            name: userDetails.name,
            metadata: {
                userId,
            },
        });

        await adminDb.collection("users").doc(userId).set({
            stripeCustomerId: customer.id,
        })
        
        // update the user with the new stripeCustomerId
        await adminDb.collection("users").doc(userId).update({
            stripeCustomerId,
        });

        stripeCustomerId = customer.id;
    }
    
    // cretae Stripe checkout session
    const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card", "amazon_pay"],
        line_items: [
            {
                price: "prod_QZ41aFToQqv8Qq",
                quantity: 1,
            }
        ],
        mode: "subscription",
        customer: stripeCustomerId,
        success_url: `${getBaseUrl()}/dashboard?upgrade=true`,
        cancel_url: `${getBaseUrl()}/upgrade`
    })

    // return the session id
    return session.id;

}