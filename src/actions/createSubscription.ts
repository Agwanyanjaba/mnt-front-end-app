import { Prisma } from "@prisma/client";
import prisma from "@/vendor/db";

export const createOrUpdateSubscription = async (
    userId: string,
    amount: number,
    phoneNumber: string,
    startDate: Date,
    expiryDate: Date,
    status: 'ACTIVE' | 'EXPIRED' | 'CANCELED'
) => {
    try {
        // Check if an active subscription exists for the given phone number
        const existingActiveSubscription = await prisma.subscription.findFirst({
            where: {
                phoneNumber: phoneNumber,
                status: 'ACTIVE',
            },
        });

        if (existingActiveSubscription) {
            // If an active subscription exists, return it without updating
            return existingActiveSubscription;
        }

        // If no active subscription exists, create a new one
        return await prisma.subscription.create({
            data: {
                userId: userId,
                amount: amount,
                phoneNumber: phoneNumber,
                startDate: startDate,
                expiryDate: expiryDate,
                status: status,
            },
        });
    } catch (error: unknown) {
        if (typeof error === "object" && error !== null && "code" in error) {
            const prismaError = error as { code: string; message: string };
            if (prismaError.code === "P2002") {
                console.error("Unique constraint violation:", prismaError.message);
            } else {
                console.error("Prisma error:", prismaError.message);
            }
        } else {
            console.error("Unknown error:", error);
        }
    }
}