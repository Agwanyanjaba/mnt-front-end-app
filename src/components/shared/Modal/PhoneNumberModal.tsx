import { useState } from "react";

interface PhoneNumberModalProps {
    userId: string;
    initialPhoneNumber: string | null;
    onSuccess?: () => void; // Optional prop with a default fallback
}

const PhoneNumberModal: React.FC<PhoneNumberModalProps> = ({
                                                               userId,
                                                               initialPhoneNumber,
                                                               onSuccess = () => {}, // Default no-op function
                                                           }) => {
    const [phoneNumber, setPhoneNumber] = useState(initialPhoneNumber || "");
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleSave = async () => {
        setLoading(true);
        setError(null);

        try {
            const paymentResponse = await initiatePayment(phoneNumber, userId); // Call initiatePayment here

            // Parse the paymentResponse as JSON
            const parsedResponse = JSON.parse(paymentResponse);

            // Extract the necessary fields
            const { ResponseCode, CheckoutRequestID } = parsedResponse.data;

            if (ResponseCode === "0") {
                //process the callback response
                const paymentConfirmationResponse = await confirmPayment(CheckoutRequestID);
                if (paymentConfirmationResponse) {
                    onSuccess(); // Notify parent component of success
                }

                console.log("Payment confirmation response:", paymentConfirmationResponse);
            } else {
                setError("Payment initiation failed. Please try again.");
            }


        } catch (err: any) {
            setError(err.message || "Failed to initiate payment. Please try again.");
        } finally {
            setLoading(false);
        }

    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-11/12 sm:w-1/2 lg:w-1/3">
                <img
                    src="/images/logo.jpeg"
                    alt="Logo"
                    className="mx-auto mb-4 w-32 h-auto rounded-lg"
                />
                <p className="text-gray-600 mb-4">
                    Please provide your phone number to continue. KSh. 300 will be charged.
                </p>
                <input
                    type="tel"
                    className="w-full p-3 border border-gray-300 rounded-lg mb-4 text-black"
                    placeholder="Enter your phone number"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                />

                {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
                <div className="flex justify-center">
                    <button
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg"
                        onClick={handleSave}
                        disabled={loading || !phoneNumber}
                    >
                        {loading ? "Saving..." : "Subscribe"}
                    </button>
                </div>
            </div>
        </div>
    );
};

const initiatePayment = async (phoneNumber: string, userId: string): Promise<string> => {
    try {
        const response = await fetch("/api/stkpush", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ phoneNumber, userId }),
        });

        if (!response.ok) {
            throw new Error("Failed to initiate payment");
        }

        const responseText = await response.text();
        console.log("=Payment Response from Backed", responseText);
        return responseText; // Return the raw response as a string
    } catch (error) {
        console.error("Error initiating payment:", error);
        throw error;
    }
};


const confirmPayment = async (checkoutRequestID: string) => {
    console.log("Request checkout id", checkoutRequestID);
    try {
        const response = await fetch("/api/paymentconfirmation", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ checkoutRequestID }),
        });
        console.log("=Payment Confirmation Response  ", response);
        if(!response.ok){
            throw  new Error("Failed to confirm payment");
        }
        const responseText = await response.text();
        console.log(responseText);
        return responseText;
    } catch (error) {
        console.error("Error initiating payment:", error);
        throw error; // Rethrow the error for the caller to handle
    }
};

export default PhoneNumberModal;
