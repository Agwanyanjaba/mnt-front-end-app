"use client";

import { useState } from "react";
import PhoneNumberModal from "@/components/shared/Modal/PhoneNumberModal";

interface PhoneNumberModalClientProps {
    userId: string;
    phoneNumber: string | null;
}

const PhoneNumberModalClient: React.FC<PhoneNumberModalClientProps> = ({ userId, phoneNumber }) => {
    const [isOpen, setIsOpen] = useState(true); // Modal opens initially

    const handleClose = () => {
        setIsOpen(false); // Close the modal
    };

    return (
        <>
            {isOpen && (
                <PhoneNumberModal
                    userId={userId}
                    initialPhoneNumber={phoneNumber}
                    onClose={handleClose}
                />
            )}
        </>
    );
};

export default PhoneNumberModalClient;
