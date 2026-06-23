"use server";

import { redirect } from "next/navigation";

export interface PaymentState {
  error: string | null;
  fieldErrors: Record<string, string>;
  paystackUrl: string | null;
}

export async function initiatePayment(
  _prevState: PaymentState,
  formData: FormData,
): Promise<PaymentState> {
  const name = (formData.get("name") as string | null)?.trim() ?? "";
  const email = (formData.get("email") as string | null)?.trim() ?? "";
  const amountRaw = (formData.get("amount") as string | null)?.trim() ?? "";

  const fieldErrors: Record<string, string> = {};

  if (name.length < 2) {
    fieldErrors.name = "Please enter your full name.";
  }

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    fieldErrors.email = "Please enter a valid email address.";
  }

  const amountNaira = Number(amountRaw);
  if (!amountRaw || isNaN(amountNaira) || amountNaira < 100) {
    fieldErrors.amount = "Amount must be at least ₦100.";
  }

  if (Object.keys(fieldErrors).length > 0) {
    return { error: null, fieldErrors, paystackUrl: null };
  }

  const secretKey = process.env.PAYSTACK_SECRET_KEY;
  if (!secretKey) {
    return {
      error: "Payment service is not configured. Please contact support.",
      fieldErrors: {},
      paystackUrl: null,
    };
  }

  const amountKobo = Math.round(amountNaira * 100);

  try {
    const response = await fetch(
      "https://api.paystack.co/transaction/initialize",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${secretKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          amount: amountKobo,
          callback_url:
            "http://localhost:3000/payment/success",
          metadata: {
            custom_fields: [
              {
                display_name: "Full Name",
                variable_name: "full_name",
                value: name,
              },
            ],
          },
        }),
      },
    );

    if (!response.ok) {
      const body = await response.json().catch(() => ({}));
      const message =
        (body as { message?: string }).message ??
        "Payment initialisation failed.";
      return { error: message, fieldErrors: {}, paystackUrl: null };
    }

    const data = (await response.json()) as {
      status: boolean;
      message: string;
      data: { authorization_url: string };
    };

    if (!data.status || !data.data?.authorization_url) {
      return {
        error: data.message || "Could not generate a payment link.",
        fieldErrors: {},
        paystackUrl: null,
      };
    }

    redirect(data.data.authorization_url);
  } catch (err) {
    if (
      err instanceof Error &&
      (err.message === "NEXT_REDIRECT" ||
        (err as { digest?: string }).digest?.startsWith("NEXT_REDIRECT"))
    ) {
      throw err;
    }

    const message =
      err instanceof Error ? err.message : "An unexpected error occurred.";
    return { error: message, fieldErrors: {}, paystackUrl: null };
  }
}
