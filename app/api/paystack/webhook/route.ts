import { NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(req: Request) {
    try {
        const rawBody = await req.text();

        const signature = req.headers.get("x-paystack-signature");
        const secretKey = process.env.PAYSTACK_SECRET_KEY;

        if (!signature || !secretKey) {
            return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
        }

        const hash = crypto
            .createHmac("sha512", secretKey)
            .update(rawBody)
            .digest("hex");

        if (hash !== signature) {
            return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
        }

        const event = JSON.parse(rawBody);

        switch (event.event) {
            case "charge.success":
                const successfulPayment = event.data;
                console.log(`Payment of ₦${successfulPayment.amount / 100} was successful!`);
                console.log(`Reference: ${successfulPayment.reference}`);
                break;

            case "charge.failed":
                const failedPayment = event.data;
                console.log(` Payment failed for reference: ${failedPayment.reference}`);
                console.log(`Reason: ${failedPayment.gateway_response}`);
                break;

            default:
                console.log(`Unhandled event type: ${event.event}`);
                break;
        }

        return NextResponse.json({ status: "success" }, { status: 200 });

    } catch (error) {
        console.error("Webhook Error:", error);
        return NextResponse.json({ error: "Webhook handler failed" }, { status: 500 });
    }
}