import { NextResponse } from "next/server";
import prisma from "@/vendor/db";

export async function POST(req: Request) {
    try {
        const body = await req.json(); // Parse JSON body from the request
        const { userId, amount, phoneNumber, startDate, expiryDate, status } = body;

        if (!userId || !amount || !phoneNumber || !startDate || !expiryDate || !status) {
            return NextResponse.json(
                { error: "Missing required fields" },
                { status: 400 }
            );
        }

        // Check for an existing active subscription
        const existingActiveSubscription = await prisma.subscription.findFirst({
            where: {
                phoneNumber,
                status: "ACTIVE",
            },
        });

        if (existingActiveSubscription) {
            return NextResponse.json(
                { subscription: existingActiveSubscription },
                { status: 200 }
            );
        }

        // Create a new subscription
        const newSubscription = await prisma.subscription.create({
            data: {
                userId,
                amount,
                phoneNumber,
                startDate: new Date(startDate),
                expiryDate: new Date(expiryDate),
                status,
            },
        });

        return NextResponse.json(
            { subscription: newSubscription },
            { status: 201 }
        );
    } catch (error: unknown) {
        console.error("Error creating or updating subscription:", error);

        if (error instanceof Error) {
            return NextResponse.json(
                { error: error.message || "Internal server error" },
                { status: 500 }
            );
        }

        return NextResponse.json(
            { error: "Unknown error occurred" },
            { status: 500 }
        );
    }
}
