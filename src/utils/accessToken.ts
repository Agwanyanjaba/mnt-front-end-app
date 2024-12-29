export async function generateMpesaAuthToken(consumerKey: string, consumerSecret: string): Promise<string> {
    const credentials = `${consumerKey}:${consumerSecret}`;
    const encodedCredentials = Buffer.from(credentials).toString("base64");

    try {
        const response = await fetch("https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials", {
            method: "GET",
            headers: {
                Authorization: `Basic ${encodedCredentials}`,
            },
        });

        if (!response.ok) {
            const errorDetails = await response.text(); // Capture response body for debugging
            throw new Error(`Failed to generate M-Pesa token. Response: ${errorDetails}`);
        }

        const data = await response.json();
        console.log("Access token:", data.access_token);
        return data.access_token;
    } catch (error) {
        console.error("Error generating M-Pesa token:", error);
        throw new Error("Failed to generate M-Pesa token");
    }
}
