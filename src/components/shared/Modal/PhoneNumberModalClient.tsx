"use client";

import { useState } from "react";
import PhoneNumberModal from "@/components/shared/Modal/PhoneNumberModal";

interface PhoneNumberModalClientProps {
    userId: string;
    phoneNumber: string | null;
}

const PhoneNumberModalClient: React.FC<PhoneNumberModalClientProps> = ({
                                                                           userId,
                                                                           phoneNumber,
                                                                       }) => {
    const [isOpen, setIsOpen] = useState(true); // Modal opens initially

    const handleClose = () => {
        setIsOpen(false); // Close the modal
    };

    const handleSuccess = () => {
        setIsOpen(false); // Close the modal when success happens
    };

    return (
        <>
            {isOpen && (
                <PhoneNumberModal
                    userId={userId}
                    initialPhoneNumber={phoneNumber}
                    onSuccess={handleSuccess} // Handle success to close the modal
                    onClose={handleClose} // Pass onClose to be triggered inside the modal
                />
            )}
        </>
    );
};

export default PhoneNumberModalClient;
