import { useState } from "react";

interface PhoneNumberModalProps {
    userId: string;
    initialPhoneNumber: string | null;
    onSuccess?: () => void;
    onClose?: () => void;
}

const PhoneNumberModal: React.FC<PhoneNumberModalProps> = ({
                                                               userId,
                                                               initialPhoneNumber,
                                                               onSuccess = () => {},
                                                               onClose,
                                                           }) => {
    const [phoneNumber, setPhoneNumber] = useState(initialPhoneNumber || "");
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleSave = async () => {
        setLoading(true);
        setError(null);

        try {
            // Step 1: Initiate Payment
            const { success, data, errorMessage } = await initiatePayment(phoneNumber, userId);

            if (!success) {
                setError(errorMessage || "Payment initiation failed. Please try again.");
                return;
            }

            const { ResponseCode, CheckoutRequestID, ResponseDescription, CustomerMessage } = data;

            if (ResponseCode === "0") {
                const subscriptionAmount = 300; // Subscription amount
                const status: "ACTIVE" = "ACTIVE"; // Subscription status
                const startDate = new Date();
                const expiryDate = new Date();
                expiryDate.setDate(startDate.getDate() + 30);

                // Step 2: Create or Update Subscription via Backend API
                const subscriptionResponse = await fetch("/api/subscription", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        userId,
                        amount: subscriptionAmount,
                        phoneNumber,
                        startDate: startDate.toISOString(),
                        expiryDate: expiryDate.toISOString(),
                        status,
                    }),
                });

                if (!subscriptionResponse.ok) {
                    throw new Error("Failed to create or update subscription.");
                }

                const subscription = await subscriptionResponse.json();
                console.log("Subscription created or updated:", subscription);

                // Notify parent component of success
                onSuccess(); // Notify the parent component to close the modal
                if (onClose) onClose(); // Ensure the modal is closed
            } else {
                setError("Payment initiation failed. Please try again.");
            }
        } catch (err: any) {
            setError(err.message || "Failed to process your subscription.");
            console.error("Error:", err);
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

const initiatePayment = async (phoneNumber: string, userId: string): Promise<{ success: boolean; data?: any; errorMessage?: string }> => {
    try {
        const response = await fetch("/api/stkpush", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ phoneNumber, userId }),
        });

        const responseText = await response.text();
        let parsedResponse;

        // Parse the response text as JSON
        try {
            parsedResponse = JSON.parse(responseText);
        } catch (error) {
            throw new Error("Failed to parse the response text.");
        }

        if (!response.ok) {
            const errorMessage = parsedResponse?.error || "Failed to initiate payment";
            return { success: false, errorMessage };
        }

        if (parsedResponse?.message === "STK Push initiated successfully") {
            const { MerchantRequestID, CheckoutRequestID, ResponseCode, ResponseDescription, CustomerMessage } = parsedResponse?.data;
            return {
                success: true,
                data: {
                    MerchantRequestID,
                    CheckoutRequestID,
                    ResponseCode,
                    ResponseDescription,
                    CustomerMessage,
                }
            };
        }

        throw new Error("Unexpected response format");

    } catch (error) {
        console.error("Error initiating payment:", error);
        // @ts-ignore
        return { success: false, errorMessage: error.message || "Failed to initiate payment" };
    }
};

export default PhoneNumberModal;
