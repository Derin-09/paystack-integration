export default async function SuccessPage({
    searchParams,
}: {
    searchParams: Promise<{
        reference?: string;
    }>;
}) {
    const params = await searchParams;

    const response = await fetch(
        `${process.env.NEXT_PUBLIC_APP_URL}/api/paystack/verify?reference=${params.reference}`,
        {
            cache: "no-store",
        }
    );

    const result = await response.json();

    const status = result.data.status;

    return (
        <div>
            <h1>
                {status === "success"
                    ? "Payment Successful"
                    : "Payment Failed"}
            </h1>

            <p>
                Reference:
                {params.reference}
            </p>

            <p>
                Amount:
                ₦
                {result.data.amount / 100}
            </p>
        </div>
    );
}