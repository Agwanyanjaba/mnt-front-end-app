import { NextResponse } from "next/server";
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

const generateTimestamp = (): string => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const date = String(now.getDate()).padStart(2, "0");
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const seconds = String(now.getSeconds()).padStart(2, "0");
    return `${year}${month}${date}${hours}${minutes}${seconds}`;
};


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

    const shortCode = "174379"; // Business Short Code
    const passkey = "bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919"; // Pass Key
    const timestamp = generateTimestamp();
    console.log("Timestamp", timestamp);
    const password = Buffer.from(shortCode + passkey + timestamp).toString("base64");

    const formattedPhoneNumber = phoneNumber.startsWith("0")
        ? "254" + phoneNumber.slice(1)
        : phoneNumber;

    const requestBody = {
        BusinessShortCode: shortCode,
        Password: password,
        Timestamp: timestamp,
        TransactionType: "CustomerPayBillOnline",
        Amount: 1,
        PartyA: formattedPhoneNumber,
        PartyB: shortCode,
        PhoneNumber: formattedPhoneNumber,
        CallBackURL: process.env.PAYMENT_CALLBACK_URL+"/api/stkpushcallback",
        AccountReference: "MzikiNiTamu",
        TransactionDesc: "Payment of Mziki Ni Tamu Subscription",
    };

    const response = await fetch("https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest", {
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


