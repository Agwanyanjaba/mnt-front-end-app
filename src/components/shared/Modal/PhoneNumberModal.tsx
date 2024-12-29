"use client";

import { useState } from "react";

interface PhoneNumberModalProps {
    userId: string;
    initialPhoneNumber: string | null;
    onSuccess: () => void;
}

const PhoneNumberModal: React.FC<PhoneNumberModalProps> = ({ userId, initialPhoneNumber, onSuccess }) => {
    const [phoneNumber, setPhoneNumber] = useState(initialPhoneNumber || "");
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleSave = async () => {
        setLoading(true);
        setError(null);

        try {
            await initiatePayment(phoneNumber, userId); // Call initiatePayment here
            onSuccess(); // Notify parent component of success
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

// Function to initiate payment by calling the API
const initiatePayment = async (phoneNumber: string, userId: string) => {
    try {
        const response = await fetch("/api/stkpush", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ phoneNumber, userId }),
        });
        console.log("Response text:", response.text()); // Log the raw response
        const text = await response.text(); // Read the raw response as text


        // Check if the response is valid JSON
        try {
            const data = JSON.parse(text); // Try parsing as JSON
            console.log(data); // Handle the response as needed
        } catch (e) {
            console.error("Invalid JSON response:", e);
        }
    } catch (error) {
        console.error("Error initiating payment:", error);
    }
};

export default PhoneNumberModal;
