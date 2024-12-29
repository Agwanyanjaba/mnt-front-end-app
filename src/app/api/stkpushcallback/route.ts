import { NextResponse } from "next/server";
import axios from "axios";

// @desc callback route Safaricom will post transaction status
// @method POST
// @route /stkPushCallback/:Order_ID
// @access public
export async function POST(request: Request) {
    try {

        // Get the callback data from Safaricom
        const body = await request.json();

        const {
            MerchantRequestID,
            CheckoutRequestID,
            ResultCode,
            ResultDesc,
            CallbackMetadata,
        } = body.Body.stkCallback;

        // TypeScript cast for CallbackMetadata.Item as an array of objects with `Name` and `Value` properties
        const meta = Object.values(CallbackMetadata.Item) as { Name: string, Value: any }[];

        // Extract metadata
        const PhoneNumber = meta.find(o => o.Name === 'PhoneNumber')?.Value.toString() || '';
        const Amount = meta.find(o => o.Name === 'Amount')?.Value.toString() || '';
        const MpesaReceiptNumber = meta.find(o => o.Name === 'MpesaReceiptNumber')?.Value.toString() || '';
        const TransactionDate = meta.find(o => o.Name === 'TransactionDate')?.Value.toString() || '';

        // Log the received callback details for debugging
        console.log("-".repeat(20), " CALLBACK RECEIVED ", "-".repeat(20));
        console.log(`
            MerchantRequestID : ${MerchantRequestID},
            CheckoutRequestID: ${CheckoutRequestID},
            ResultCode: ${ResultCode},
            ResultDesc: ${ResultDesc},
            PhoneNumber : ${PhoneNumber},
            Amount: ${Amount}, 
            MpesaReceiptNumber: ${MpesaReceiptNumber},
            TransactionDate : ${TransactionDate}
        `);

        // Optionally, you can send the data to your database or another API for processing
        // await axios.post('your-database-or-transaction-api-endpoint', {
        //     Payment_ID,
        //     MerchantRequestID,
        //     CheckoutRequestID,
        //     ResultCode,
        //     ResultDesc,
        //     PhoneNumber,
        //     Amount,
        //     MpesaReceiptNumber,
        //     TransactionDate,
        // });

        // Respond with a success message
        return NextResponse.json({
            message: "Callback processed successfully",
        });

    } catch (error) {
        console.error("Error processing the callback", error);

        // Handle error and return appropriate response
        return NextResponse.json({
            error: error instanceof Error ? error.message : "Unknown error occurred",
        }, { status: 500 });
    }
}
