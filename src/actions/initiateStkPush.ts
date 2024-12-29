export async function sendStkPush(userId: string, phoneNumber: string): Promise<void> {

    console.log("Initiating M-Pesa STK Push for:", phoneNumber, userId);

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

    const headers = new Headers();
    const PASS_KEY = "bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919";

    const SAFARICOM_CONSUMER_SECRET="wfAA9sXnkmFQYVI0";
    const SAFARICOM_CONSUMER_KEY="tsepqgt0YvMzWAim56tSGUi2yS2m07wo";
    const BUSINESS_SHORT_CODE = 174379;

    headers.append("Content-Type", "application/json");
    headers.append("Authorization", "Bearer dASn9Kay5S1gStmhUJP4GeJsY2oX");

    const shortCode = "174379";
    const timestamp = generateTimestamp();
    const formattedPhoneNumber = formatPhoneNumber(phoneNumber);
    //generate password
    const password = generatePassword(shortCode, PASS_KEY, timestamp);
    console.log("Generated Password:", password);


    const requestBody = {
        BusinessShortCode: BUSINESS_SHORT_CODE,
        Password: password,
        Timestamp: timestamp,
        TransactionType: "CustomerPayBillOnline",
        Amount: 1,
        PartyA: formattedPhoneNumber,
        PartyB: BUSINESS_SHORT_CODE,
        PhoneNumber: formattedPhoneNumber,
        CallBackURL: "https://mydomain.com/path", // Replace with your callback URL
        AccountReference: "MzikiNiTamu",
        TransactionDesc: "Payment of Mziki Ni Tamu Subscription",
    };

    function generatePassword(shortCode: string, passkey: string, timestamp: string): string {
        const dataToEncode = shortCode + passkey + timestamp;
        return Buffer.from(dataToEncode).toString("base64");
    }

    //format phone number
    function formatPhoneNumber(phoneNumber: string): string {
        // Remove the first character if it's '0' and prefix with '254'
        if (phoneNumber.startsWith("0")) {
            return "254" + phoneNumber.slice(1);
        }
        return phoneNumber; //validate that phone number is 12 digits
    }

    try {
        const response = await fetch("https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest", {
            method: "POST",
            headers,
            body: JSON.stringify(requestBody),
        });
        console.log("==response", response)
        if (!response.ok) {
            const errorDetails = await response.text();
            console.error("M-Pesa STK Push failed:", errorDetails);
            throw new Error("Failed to initiate M-Pesa STK Push.");
        }

        const result = await response.text();
        console.log("M-Pesa STK Push response:", result);
    } catch (error) {
        console.error("Error occurred during M-Pesa request:", error);
        throw new Error("M-Pesa STK Push request failed.");
    }

    async function generateMpesaAuthToken(consumerKey: string, consumerSecret: string): Promise<string> {
        const credentials = `${consumerKey}:${consumerSecret}`;
        const encodedCredentials = Buffer.from(credentials).toString("base64");

        const response = await fetch("https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials", {
            method: "GET",
            headers: {
                Authorization: `Basic ${encodedCredentials}`,
            },
        });

        if (!response.ok) {
            throw new Error("Failed to generate M-Pesa token");
        }

        const data = await response.json();
        return data.access_token; // Return the token
    }

    generateMpesaAuthToken(SAFARICOM_CONSUMER_KEY, SAFARICOM_CONSUMER_SECRET)
        .then((token) => {
            console.log("Authorization Token:", token);
        })
        .catch((error) => {
            console.error("Error generating token:", error.message);
        });

}