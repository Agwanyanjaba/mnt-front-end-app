import { NextResponse } from "next/server";
import { generateMpesaAuthToken } from "@/utils/accessToken";
import { getTimestamp } from "@/utils/timeStamp";

export async function POST(request: Request) {
    try {
        const { CheckoutRequestID } = await request.json();
        if (!CheckoutRequestID) {
            return NextResponse.json({ error: "CheckoutRequestID is required" }, { status: 400 });
        }

        const consumerKey = process.env.MPESA_CONSUMER_KEY || "";
        const consumerSecret = process.env.MPESA_CONSUMER_SECRET || "";
        const authToken = await generateMpesaAuthToken(consumerKey, consumerSecret);

        const timestamp = getTimestamp();
        const password = Buffer.from(
            `${process.env.BUSINESS_SHORT_CODE}${process.env.PASS_KEY}${timestamp}`
        ).toString("base64");

        const url = process.env.PAYMENT_CONFRIMATION_URL;
        // @ts-ignore
        const response = await fetch(url, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${authToken}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                BusinessShortCode: process.env.BUSINESS_SHORT_CODE,
                Password: password,
                Timestamp: timestamp,
                CheckoutRequestID,
            }),
        });

        if (!response.ok) {
            const errorDetails = await response.json();
            return NextResponse.json(
                { message: "Failed to confirm payment", error: errorDetails },
                { status: response.status }
            );
        }

        const data = await response.json();
        return NextResponse.json({ message: "Payment status retrieved successfully", data });
    } catch (error: unknown) {
        if (error instanceof Error) {
            return NextResponse.json(
                { message: "Error occurred while confirming payment", error: error.message },
                { status: 500 }
            );
        } else {
            return NextResponse.json(
                { message: "Unknown error occurred while confirming payment" },
                { status: 500 }
            );
        }
    }
}

