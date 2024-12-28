"use client";

import React, { createContext, useContext, ReactNode, useState, useEffect } from "react";
import getPaidSubscriptions from "@/actions/getPaidSubscriptions";
import {$Enums} from ".prisma/client";
import SubscriptionStatus = $Enums.SubscriptionStatus;

// Define the structure of the Subscription object
interface Subscription {
    id: string;
    userId: string;
    amount: number;
    startDate: Date;
    expiryDate: Date;
    status: SubscriptionStatus;
    createdAt: Date;
    updatedAt: Date;
    // Add other relevant properties as needed
}

// Props for PaidSubscriptionProvider
interface PaidSubscriptionProviderProps {
    email: string | null;  // User email or identifier
    children: ReactNode;
}

// Create the context to hold the Subscription object or null (when no subscription is found or loading)
const PaidSubscriptionContext = createContext<Subscription | null>(null);  // null represents loading or no subscription

// Hook to consume the context
export const usePaidSubscriptionContext = () => {
    const context = useContext(PaidSubscriptionContext);
    if (context === null) {
        throw new Error("usePaidSubscriptionContext must be used within a PaidSubscriptionProvider");
    }
    return context;
};

// Fetch the subscription for a specific user (email)
const fetchSubscription = async (email: string | null): Promise<Subscription | null> => {
    try {
        const subscriptions = await getPaidSubscriptions(email);  // Assuming this fetches the subscriptions for the user

        // Return the first subscription if it exists, otherwise null
        if (Array.isArray(subscriptions) && subscriptions.length > 0) {
            return subscriptions[0];  // Return the topmost subscription (you can modify this logic if needed)
        }
        return null;  // No active subscription
    } catch (error) {
        console.error("Error fetching subscriptions:", error);
        return null;  // Return null if there's an error
    }
};

// Provider component to wrap the app and provide the subscription object
export const PaidSubscriptionProvider: React.FC<PaidSubscriptionProviderProps> = ({ email, children }) => {
    const [subscription, setSubscription] = useState<Subscription | null>(null);  // null for loading or no subscription

    // UseEffect to fetch the subscription when the component mounts
    useEffect(() => {
        const loadSubscription = async () => {
            const fetchedSubscription = await fetchSubscription(email);
            setSubscription(fetchedSubscription);
        };

        loadSubscription();
    }, [email]);  // Re-fetch if the email changes

    return (
        <PaidSubscriptionContext.Provider value={subscription}>
            {children}
        </PaidSubscriptionContext.Provider>
    );
};

export default PaidSubscriptionContext;
