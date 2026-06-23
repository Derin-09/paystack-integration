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
            <h1 className="text-2xl font-bold text-green-600 mb-4">Payment Successful </h1>
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


