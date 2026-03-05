import React, { useState } from "react";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import { useNavigate } from "react-router-dom";
import { createCardPayment } from "../../api/paymentApi.js";


export default function CheckoutForm({ clientSecret, bookingId, customerId, customerName, phoneNumber, amount, discount, totalAmount }) {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();

  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setProcessing(true);
    setError("");

    const cardElement = elements.getElement(CardElement);

    const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: cardElement,
        billing_details: {
          name: customerName,
          phone: phoneNumber,
        },
      },
    });

    if (stripeError) {
      setError(stripeError.message);
      setProcessing(false);
      return;
    }

    if (paymentIntent && paymentIntent.status === "succeeded") {
      // Save the payment record in the backend
      try {
        const response = await createCardPayment({
        
          bookingId: bookingId,
          customerId: customerId,
          customerName,
          phoneNumber,
          amount: Math.round(totalAmount * 100), // amount in cents for backend
          discountAmount: discount ? Math.round(discount * 100) : 0,
          currency: "usd",
          description: paymentIntent.id, // store the Stripe PaymentIntent ID
        });

        // Navigate to success receipt
        navigate("/payment-success", {
          state: {
            customerName,
            phoneNumber,
            amount,
            discount: discount || 0,
            totalAmount,
            paymentId: response?.data?.paymentId,
            stripePaymentIntentId: paymentIntent.id,
            paymentDate: response?.data?.paymentDate || new Date().toISOString(),
          },
        });
      } catch (saveError) {
        // Payment succeeded on Stripe but failed to save — still show success
        navigate("/payment-success", {
          state: {
            customerName,
            phoneNumber,
            amount,
            discount: discount || 0,
            totalAmount,
            stripePaymentIntentId: paymentIntent.id,
            paymentDate: new Date().toISOString(),
          },
        });
      }
    }

    setProcessing(false);
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <div style={styles.cardSection}>
        <label style={styles.cardLabel}>Card Details</label>
        <div style={styles.cardElementWrapper}>
          <CardElement
            options={{
              style: {
                base: {
                  fontSize: "16px",
                  color: "#1e293b",
                  fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
                  "::placeholder": { color: "#94a3b8" },
                },
                invalid: { color: "#ef4444" },
              },
            }}
          />
        </div>
      </div>

      {error && (
        <div style={styles.errorBox}>
          ⚠️ {error}
        </div>
      )}

      <button
        type="submit"
        disabled={!stripe || processing}
        style={{
          ...styles.submitBtn,
          opacity: processing ? 0.7 : 1,
        }}
      >
        {processing ? "Processing Payment..." : `Pay LKR ${totalAmount?.toFixed?.(2) || totalAmount} Now`}
      </button>

      <p style={styles.secureText}>🔒 Your payment is secured by Stripe</p>
    </form>
  );
}

const styles = {
  cardSection: {
    backgroundColor: "#f8fafc",
    padding: "18px",
    borderRadius: "14px",
    border: "1px solid #e2e8f0",
  },
  cardLabel: {
    display: "block",
    fontSize: "13px",
    fontWeight: "700",
    color: "#475569",
    marginBottom: "10px",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  },
  cardElementWrapper: {
    padding: "14px",
    backgroundColor: "#fff",
    borderRadius: "10px",
    border: "1.5px solid #d1d5db",
  },
  errorBox: {
    padding: "12px 16px",
    backgroundColor: "#fef2f2",
    border: "1px solid #fecaca",
    borderRadius: "10px",
    color: "#dc2626",
    fontSize: "14px",
  },
  submitBtn: {
    padding: "15px",
    backgroundColor: "#1fbf6b",
    color: "white",
    fontWeight: "bold",
    fontSize: "16px",
    borderRadius: "14px",
    border: "none",
    cursor: "pointer",
    boxShadow: "0 4px 14px rgba(31, 191, 107, 0.3)",
    transition: "all 0.2s",
  },
  secureText: {
    textAlign: "center",
    fontSize: "12px",
    color: "#94a3b8",
    margin: "0",
  },
};