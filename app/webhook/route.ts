import { headers } from "next/headers";
import { NextRequest } from "next/server";

export async function POST(req:NextRequest) {
    const headersList = headers
    const body = await req.text();
    // const signature = headersList.get("stripe-signature");

}