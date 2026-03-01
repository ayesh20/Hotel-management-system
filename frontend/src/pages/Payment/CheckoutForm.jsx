import React from "react";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";

export default function CheckoutForm({ clientSecret, customerName, phoneNumber, totalAmount }) {
  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    const cardElement = elements.getElement(CardElement);

    const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: cardElement,
        billing_details: {
          name: customerName,
          phone: phoneNumber,
        },
      },
    });

    if (error) {
      alert(error.message);
    } else if (paymentIntent && paymentIntent.status === "succeeded") {
      alert("Payment Successful! ✅");
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
      <label>
        Card Details
        <CardElement
          options={{
            style: {
              base: { fontSize: "16px", color: "#32325d", "::placeholder": { color: "#a0aec0" } },
              invalid: { color: "#fa755a" },
            },
          }}
        />
      </label>

      <button
        type="submit"
        disabled={!stripe}
        style={{
          padding: "12px",
          backgroundColor: "#1fbf6b",
          color: "white",
          fontWeight: "bold",
          borderRadius: "10px",
          border: "none",
          cursor: "pointer",
        }}
      >
        Pay LKR {totalAmount}
      </button>
    </form>
  );
}