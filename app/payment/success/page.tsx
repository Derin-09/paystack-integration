"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

export default function SuccessPage() {
    const searchParams = useSearchParams();
    const reference = searchParams.get("reference");

    const [loading, setLoading] = useState(true);
    const [status, setStatus] = useState<
        "success" | "failed" | "missing"
    >("success");
    const [data, setData] = useState<any>(null);

    useEffect(() => {
        const verify = async () => {
            if (!reference) {
                setStatus("missing");
                setLoading(false);
                return;
            }

            try {
                const res = await fetch(
                    `/api/paystack/verify?reference=${reference}`
                );

                const result = await res.json();

                setData(result);

                if (result?.data?.status === "success") {
                    setStatus("success");
                } else {
                    setStatus("failed");
                }
            } catch {
                setStatus("failed");
            } finally {
                setLoading(false);
            }
        };

        verify();
    }, [reference]);

    if (loading) {
        return <div>Verifying payment...</div>;
    }

    if (status === "missing") {
        return (
            <div>
                No payment reference found.
                Please complete payment first.
            </div>
        );
    }

    if (status === "failed") {
        return (
            <div>
                Payment failed or could not be verified.
            </div>
        );
    }

    return (
        <div>
            <h1>Payment Successful</h1>

            <p>
                Reference: {reference}
            </p>

            <p>
                Amount: ₦
                {data?.data?.amount / 100}
            </p>
        </div>
    );
}





// "use client";

// import { useEffect, useState } from "react";
// import { useSearchParams } from "next/navigation";

// type PaymentState =
//     | "loading"
//     | "success"
//     | "failed"
//     | "missing";

// export default function PaymentSuccessPage() {
//     const searchParams = useSearchParams();
//     const reference = searchParams.get("reference");

//     const [state, setState] =
//         useState<PaymentState>("loading");

//     const [data, setData] = useState<any>(null);

//     useEffect(() => {
//         const verifyPayment = async () => {
//             if (!reference) {
//                 setState("missing");
//                 return;
//             }

//             try {
//                 const res = await fetch(
//                     `/api/paystack/verify?reference=${reference}`
//                 );

//                 const result = await res.json();

//                 if (result?.data?.status === "success") {
//                     setState("success");
//                 } else {
//                     setState("failed");
//                 }

//                 setData(result);
//             } catch {
//                 setState("failed");
//             }
//         };

//         verifyPayment();
//     }, [reference]);

//     if (state === "loading") {
//         return (
//             <div>Verifying payment...</div>
//         );
//     }

//     if (state === "missing") {
//         return (
//             <div>
//                 No payment reference found.
//                 Please complete a transaction first.
//             </div>
//         );
//     }

//     if (state === "failed") {
//         return (
//             <div>
//                 Payment failed or could not be verified.
//             </div>
//         );
//     }

//     return (
//         <div>
//             <h1>Payment Successful 🎉</h1>

//             <p>
//                 Reference: {reference}
//             </p>

//             <p>
//                 Amount: ₦
//                 {data?.data?.amount / 100}
//             </p>
//         </div>
//     );
// }




// export default async function SuccessPage({
//     searchParams,
// }: {
//     searchParams: Promise<{
//         reference?: string;
//     }>;
// }) {
//     const params = await searchParams;

//     const response = await fetch(
//         `${process.env.NEXT_PUBLIC_APP_URL}/api/paystack/verify?reference=${params.reference}`,
//         {
//             cache: "no-store",
//         }
//     );

//     const result = await response.json();

//     const status = result.data.status;

//     return (
//         <div>
//             <h1>
//                 {status === "success"
//                     ? "Payment Successful"
//                     : "Payment Failed"}
//             </h1>

//             <p>
//                 Reference:
//                 {params.reference}
//             </p>

//             <p>
//                 Amount:
//                 ₦
//                 {result.data.amount / 100}
//             </p>
//         </div>
//     );
// }