"use client";

import { createContext, useContext } from "react";

export const PhoneContext = createContext<boolean | null>(null);

interface PhoneProviderProps {
    hasPhoneNumber: boolean;
}

const PhoneProvider: React.FC<React.PropsWithChildren<PhoneProviderProps>> = ({
                                                                                  hasPhoneNumber,
                                                                                  children,
                                                                              }) => {
    return (
        <PhoneContext.Provider value={hasPhoneNumber}>
            {children}
        </PhoneContext.Provider>
    );
};

export const usePhoneContext = () => {
    const context = useContext(PhoneContext);
    if (context === null) {
        throw new Error("usePhoneContext must be used within a PhoneProvider");
    }
    return context;
};

export default PhoneProvider;
