import { NextResponse } from "next/server";
import { getTimestamp } from "@/utils/timeStamp";

export async function POST(request: Request) {
    try {
        const { phoneNumber, userId } = await request.json();

        // Validate required fields
        if (!phoneNumber || !userId) {
            return NextResponse.json({ error: "Missing phone number or user ID" }, { status: 400 });
        }

        // Validate phone number
        const validationResult = validatePhoneNumber(phoneNumber);
        if (validationResult !== true) {
            return NextResponse.json({ error: validationResult }, { status: 400 });
        }

        const result = await initiateStkPush(phoneNumber, userId);
        return NextResponse.json({ message: "STK Push initiated successfully", data: result });
    } catch (error: unknown) {
        console.error("Error initiating STK Push:", error);

        if (error instanceof Error) {
            return NextResponse.json({ error: error.message || "Failed to initiate STK Push" }, { status: 500 });
        } else {
            return NextResponse.json({ error: "Unknown error occurred" }, { status: 500 });
        }
    }
}

// Function to validate phone number
function validatePhoneNumber(phoneNumber: string): string | boolean {
    if (phoneNumber.length !== 10) {
        return "Invalid phone number. Please ensure it has exactly 10 digits.";
    }
    if (!/^\d+$/.test(phoneNumber)) {
        return "Invalid phone number. Only numeric values are allowed.";
    }
    return true;
}

// Function to generate M-Pesa authentication token
async function generateMpesaAuthToken(consumerKey: string, consumerSecret: string): Promise<string> {
    const credentials = `${consumerKey}:${consumerSecret}`;
    const encodedCredentials = Buffer.from(credentials).toString("base64");

    const response = await fetch(
        "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials",
        {
            method: "GET",
            headers: {
                Authorization: `Basic ${encodedCredentials}`,
            },
        }
    );

    if (!response.ok) {
        throw new Error("Failed to generate M-Pesa token");
    }

    const data = await response.json();
    return data.access_token; // Return the token
}

// Function to initiate the STK push request
async function initiateStkPush(phoneNumber: string, userId: string) {
    const token = await generateMpesaAuthToken(
        process.env.SAFARICOM_CONSUMER_KEY as string,
        process.env.SAFARICOM_CONSUMER_SECRET as string
    );

    const headers = new Headers();
    headers.append("Authorization", `Bearer ${token}`);
    headers.append("Content-Type", "application/json");

    const shortCode = process.env.BUSINESS_SHORT_CODE as string; // Business Short Code
    const passkey = process.env.PASS_KEY as string;
    const timestamp = getTimestamp();

    const password = Buffer.from(shortCode + passkey + timestamp).toString("base64");

    const formattedPhoneNumber = phoneNumber.startsWith("0")
        ? "254" + phoneNumber.slice(1)
        : phoneNumber;

    const requestBody = {
        BusinessShortCode: shortCode,
        Password: password,
        Timestamp: timestamp,
        TransactionType: "CustomerPayBillOnline",
        Amount: process.env.MNT_FEE,
        PartyA: formattedPhoneNumber,
        PartyB: shortCode,
        PhoneNumber: formattedPhoneNumber,
        CallBackURL: process.env.MPESA_CALLBACK_URL,
        AccountReference: "MzikiNiTamu",
        TransactionDesc: "Payment of Mziki Ni Tamu Subscription",
    };

    const response = await fetch(process.env.PAYMENT_URL as string, {
        method: "POST",
        headers: headers,
        body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
        const errorText = await response.text();
        console.error("Error from M-Pesa API:", errorText);
        throw new Error("M-Pesa STK Push request failed");
    }

    return response.json(); // Return the response from M-Pesa API
}
