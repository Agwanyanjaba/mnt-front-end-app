import { NextResponse } from "next/server";
import {getTimestamp} from "@/utils/timeStamp";
export async function POST(request: Request) {
    try {
        const { phoneNumber, userId } = await request.json();

        if (!phoneNumber || !userId) {
            return NextResponse.error(); // Respond with an error if the data is invalid
        }

        const result = await initiateStkPush(phoneNumber, userId);

        return NextResponse.json({ message: "STK Push initiated successfully", data: result });
    } catch (error: unknown) {
        if (error instanceof Error) {
            return NextResponse.json({ error: error.message || "Failed to initiate STK Push" }, { status: 500 });
        } else {
            return NextResponse.json({ error: "Unknown error occurred" }, { status: 500 });
        }
    }

}

// Function to generate M-Pesa authentication token
async function generateMpesaAuthToken(consumerKey: string, consumerSecret: string): Promise<string> {
    const credentials = `${consumerKey}:${consumerSecret}`;
    const encodedCredentials = Buffer.from(credentials).toString("base64");

    const response = await fetch("https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials", {
        method: 'GET',
        headers: {
            Authorization: `Basic ${encodedCredentials}`,
        },
    });

    if (!response.ok) {
        throw new Error("Failed to generate M-Pesa token");
    }

    const data = await response.json();
    console.log("Access token:", data.access_token);
    return data.access_token; // Return the token
}

// Function to initiate the STK push request
async function initiateStkPush(phoneNumber: string, userId: string) {
    const token = await generateMpesaAuthToken(
        process.env.SAFARICOM_CONSUMER_KEY as string,
        process.env.SAFARICOM_CONSUMER_SECRET as string,
    );

    const headers = new Headers();
    headers.append("Authorization", `Bearer ${token}`);
    headers.append("Content-Type", "application/json");

    const shortCode = process.env.BUSINESS_SHORT_CODE; // Business Short Code
    const passkey = process.env.PASS_KEY;
    const timestamp = getTimestamp();
    console.log("Timestamp", timestamp);
    // @ts-ignore
    const password = Buffer.from(shortCode + passkey + timestamp).toString("base64");

    const formattedPhoneNumber = phoneNumber.startsWith("0")
        ? "254" + phoneNumber.slice(1)
        : phoneNumber;

    const requestBody = {
        BusinessShortCode: process.env.BUSINESS_SHORT_CODE,
        Password: password,
        Timestamp: timestamp,
        TransactionType: "CustomerPayBillOnline",
        Amount: process.env.MNT_FEE,
        PartyA: formattedPhoneNumber,
        PartyB: process.env.BUSINESS_SHORT_CODE,
        PhoneNumber: formattedPhoneNumber,
        CallBackURL: process.env.MPESA_CALLBACK_URL,
        AccountReference: "MzikiNiTamu",
        TransactionDesc: "Payment of Mziki Ni Tamu Subscription",
    };

    console.log("=Request Body:", requestBody);
    console.log("headers", headers);
    console.log("SAF URL", process.env.PAYMENT_URL)
    // @ts-ignore
    const response = await fetch(process.env.PAYMENT_URL, {
        method: "POST",
        headers: headers,
        body: JSON.stringify(requestBody),
    });

    console.log("Server API Response:", response);

    if (!response.ok) {
        console.log("Response", response.text());
        throw new Error("M-Pesa STK Push request failed");
    }

    return response.json(); // Return the response from M-Pesa API
}


