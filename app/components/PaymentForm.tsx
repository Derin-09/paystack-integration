"use client";

import { useActionState } from "react";
import { initiatePayment } from "@/app/actions/payment";

const initialState = {
  error: null as string | null,
  fieldErrors: {} as Record<string, string>,
  paystackUrl: null as string | null,
};

/* ─── Inline styles (plain objects — no external deps) ─────────────── */
const styles = {
  card: {
    width: "100%",
    maxWidth: "440px",
  } satisfies React.CSSProperties,

  heading: {
    fontSize: "1.375rem",
    fontWeight: 600,
    marginBottom: "1.75rem",
    color: "#111111",
  } satisfies React.CSSProperties,

  form: {
    display: "flex",
    flexDirection: "column" as const,
    gap: "1.25rem",
  } satisfies React.CSSProperties,

  fieldGroup: {
    display: "flex",
    flexDirection: "column" as const,
    gap: "0.375rem",
  } satisfies React.CSSProperties,

  label: {
    fontSize: "0.875rem",
    fontWeight: 500,
    color: "#333333",
  } satisfies React.CSSProperties,

  input: {
    width: "100%",
    height: "42px",
    padding: "0 10px",
    border: "1px solid #cccccc",
    borderRadius: "4px",
    fontSize: "0.9375rem",
    color: "#111111",
    background: "#ffffff",
    outline: "none",
  } satisfies React.CSSProperties,

  inputError: {
    border: "1px solid #cc0000",
  } satisfies React.CSSProperties,

  fieldError: {
    fontSize: "0.8125rem",
    color: "#cc0000",
  } satisfies React.CSSProperties,

  formError: {
    fontSize: "0.875rem",
    color: "#cc0000",
    padding: "10px 12px",
    border: "1px solid #f5c2c2",
    borderRadius: "4px",
    background: "#fff5f5",
  } satisfies React.CSSProperties,

  button: {
    marginTop: "0.5rem",
    height: "42px",
    width: "100%",
    border: "none",
    borderRadius: "4px",
    background: "#0a7cc1",
    color: "#ffffff",
    fontSize: "0.9375rem",
    fontWeight: 600,
    cursor: "pointer",
  } satisfies React.CSSProperties,

  buttonDisabled: {
    opacity: 0.65,
    cursor: "not-allowed" as const,
  } satisfies React.CSSProperties,
};

export default function PaymentForm() {
  const [state, formAction, pending] = useActionState(
    initiatePayment,
    initialState,
  );

  const fieldErrors = state?.fieldErrors ?? {};

  return (
    <section style={styles.card} aria-labelledby="payment-form-heading">
      <h1 id="payment-form-heading" style={styles.heading}>
        Payment Form
      </h1>

      <form action={formAction} style={styles.form} noValidate>
        <div style={styles.fieldGroup}>
          <label htmlFor="name" style={styles.label}>
            Full Name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            autoComplete="name"
            required
            aria-required="true"
            aria-describedby={fieldErrors.name ? "name-error" : undefined}
            aria-invalid={!!fieldErrors.name}
            style={
              fieldErrors.name
                ? { ...styles.input, ...styles.inputError }
                : styles.input
            }
            placeholder="John Doe"
          />
          {fieldErrors.name && (
            <span id="name-error" role="alert" style={styles.fieldError}>
              {fieldErrors.name}
            </span>
          )}
        </div>

        <div style={styles.fieldGroup}>
          <label htmlFor="email" style={styles.label}>
            Email Address
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            aria-required="true"
            aria-describedby={fieldErrors.email ? "email-error" : undefined}
            aria-invalid={!!fieldErrors.email}
            style={
              fieldErrors.email
                ? { ...styles.input, ...styles.inputError }
                : styles.input
            }
            placeholder="john@example.com"
          />
          {fieldErrors.email && (
            <span id="email-error" role="alert" style={styles.fieldError}>
              {fieldErrors.email}
            </span>
          )}
        </div>

        <div style={styles.fieldGroup}>
          <label htmlFor="amount" style={styles.label}>
            Amount (₦)
          </label>
          <input
            id="amount"
            name="amount"
            type="number"
            min="100"
            step="1"
            required
            aria-required="true"
            aria-describedby={fieldErrors.amount ? "amount-error" : undefined}
            aria-invalid={!!fieldErrors.amount}
            style={
              fieldErrors.amount
                ? { ...styles.input, ...styles.inputError }
                : styles.input
            }
            placeholder="5000"
          />
          {fieldErrors.amount && (
            <span id="amount-error" role="alert" style={styles.fieldError}>
              {fieldErrors.amount}
            </span>
          )}
        </div>

        {state?.error && (
          <p role="alert" aria-live="assertive" style={styles.formError}>
            {state.error}
          </p>
        )}

        <button
          id="pay-now-btn"
          type="submit"
          disabled={pending}
          aria-busy={pending}
          style={
            pending
              ? { ...styles.button, ...styles.buttonDisabled }
              : styles.button
          }
        >
          {pending ? "Processing…" : "Pay Now"}
        </button>
      </form>
    </section>
  );
}
