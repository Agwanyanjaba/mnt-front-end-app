import prisma from "@/vendor/db";

// Function to retrieve the latest subscription for a specific user
const getPaidSubscriptions = async (userId: string | null) => {
    try {
        // Query only the latest subscription for the user
        return await prisma.subscription.findFirst({
            where: {
                userId: userId ?? null ?? undefined,  // Filter by user ID (email)
            },
            orderBy: {
                startDate: 'desc',  // Order by start date (latest first)
            },
        });
    } catch (error: unknown) {
        const err = error as Error; // Type casting the error

        console.error('Error retrieving subscription:', err.message);
        return null; // Return null or handle the error accordingly
    }
};

export default getPaidSubscriptions;
