"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";


function SuccessPageContent() {
    const searchParams = useSearchParams();
    const reference = searchParams.get("reference");

    const [loading, setLoading] = useState(true);
    const [status, setStatus] = useState<"success" | "failed" | "missing">("success");
    const [data, setData] = useState<any>(null);

    useEffect(() => {
        const verify = async () => {
            if (!reference) {
                setStatus("missing");
                setLoading(false);
                return;
            }

            try {
                const res = await fetch(`/api/paystack/verify?reference=${reference}`);
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
        return <div className="text-center mt-10">Verifying payment...</div>;
    }

    if (status === "missing") {
        return (
            <div className="text-center mt-10 text-amber-600">
                No payment reference found. Please complete payment first.
            </div>
        );
    }

    if (status === "failed") {
        return (
            <div className="text-center mt-10 text-red-600">
                Payment failed or could not be verified.
            </div>
        );
    }

    return (
        <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md border border-green-200">
            <h1 className="text-2xl font-bold text-green-600 mb-4">Payment Successful 🎉</h1>
            <p className="text-sm text-gray-600 mb-2">
                <strong>Reference:</strong> {reference}
            </p>
            <p className="text-sm text-gray-600">
                <strong>Amount:</strong> ₦{data?.data?.amount / 100}
            </p>
        </div>
    );
}

export default function SuccessPage() {
    return (
        <Suspense fallback={<div className="text-center mt-10">Loading verification stream...</div>}>
            <SuccessPageContent />
        </Suspense>
    );
}





// "use client";

// import { useEffect, useState } from "react";
// import { useSearchParams } from "next/navigation";

// export default function SuccessPage() {
//     const searchParams = useSearchParams();
//     const reference = searchParams.get("reference");

//     const [loading, setLoading] = useState(true);
//     const [status, setStatus] = useState<
//         "success" | "failed" | "missing"
//     >("success");
//     const [data, setData] = useState<any>(null);

//     useEffect(() => {
//         const verify = async () => {
//             if (!reference) {
//                 setStatus("missing");
//                 setLoading(false);
//                 return;
//             }

//             try {
//                 const res = await fetch(
//                     `/api/paystack/verify?reference=${reference}`
//                 );

//                 const result = await res.json();

//                 setData(result);

//                 if (result?.data?.status === "success") {
//                     setStatus("success");
//                 } else {
//                     setStatus("failed");
//                 }
//             } catch {
//                 setStatus("failed");
//             } finally {
//                 setLoading(false);
//             }
//         };

//         verify();
//     }, [reference]);

//     if (loading) {
//         return <div>Verifying payment...</div>;
//     }

//     if (status === "missing") {
//         return (
//             <div>
//                 No payment reference found.
//                 Please complete payment first.
//             </div>
//         );
//     }

//     if (status === "failed") {
//         return (
//             <div>
//                 Payment failed or could not be verified.
//             </div>
//         );
//     }

//     return (
//         <div>
//             <h1>Payment Successful</h1>

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