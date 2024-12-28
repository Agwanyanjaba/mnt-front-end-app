import prisma from "@/vendor/db";
import {Prisma} from "@prisma/client";

const createSubscription = async (
    userId: string,
    amount: number,
    startDate: Date,
    expiryDate: Date,
    status: 'ACTIVE' | 'EXPIRED' | 'CANCELED'
) => {
    try {
        if (status === 'ACTIVE') {
            // Check if the user already has an active subscription
            const existingActiveSubscription = await prisma.subscription.findFirst({
                where: {
                    userId: userId,
                    status: 'ACTIVE',
                },
            });

            if (existingActiveSubscription) {
                throw new Error('A user can only have one active subscription.');
            }
        }

        // Create the subscription
        return await prisma.subscription.create({
            data: {
                userId: userId,
                amount: amount,
                startDate: startDate,
                expiryDate: expiryDate,
                status: status,
            },
        });
    } catch (error: unknown) {
        const err = error as Error;
        if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2002') {
            console.error('Unique constraint violation:', err.message);
        } else {
            console.error('Error creating subscription:', err.message);
        }
        return null;
    }
};
