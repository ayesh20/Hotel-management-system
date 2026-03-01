import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import CheckoutForm from "./CheckoutForm.jsx";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PK);

export default function Payment() {
  const navigate = useNavigate();

  const [customerName, setCustomerName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [amount, setAmount] = useState("");
  const [discount, setDiscount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("CARD");

  const [clientSecret, setClientSecret] = useState("");
  const [loading, setLoading] = useState(false);

  const totalAmount =
    (parseFloat(amount || 0) - parseFloat(discount || 0)).toFixed(2);

  const handlePaymentMethodChange = (method) => {
    setPaymentMethod(method);
    setClientSecret("");
  };

  const handlePayNow = async () => {
    if (!customerName || !phoneNumber || !amount) {
      alert("Please fill Customer Name, Phone Number and Amount!");
      return;
    }

    const finalAmount = Math.round(parseFloat(totalAmount) * 100); // convert to cents

    // CASH PAYMENT
    if (paymentMethod === "CASH") {
      try {
        const response = await fetch(
          "http://localhost:8082/api/payments",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              customerName,
              phoneNumber,
              amount: parseFloat(amount),
              discountAmount: parseFloat(discount || 0),
              totalAmount: parseFloat(totalAmount),
              paymentMethod: "CASH",
            }),
          }
        );

        if (!response.ok) throw new Error("Payment Failed");

        const result = await response.json();
        navigate("/checkoutform", { state: { payment: result } });
      } catch (error) {
        alert(error.message);
      }

      return;
    }

    // CARD PAYMENT (STRIPE)
    if (paymentMethod === "CARD") {
      setLoading(true);
      try {
        const response = await fetch(
          "http://localhost:8082/api/payments/create-intent",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              amount: finalAmount,
              currency: "usd", // Change only if your Stripe supports LKR
              description: "Hotel Booking Payment",
            }),
          }
        );

        const data = await response.json();
        setClientSecret(data.clientSecret);
      } catch (error) {
        alert("Stripe initialization failed");
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Payment</h2>

        {/* Customer Details */}
        <div style={styles.sectionBox}>
          <h3 style={styles.sectionTitle}>Customer Details</h3>

          <input
            style={styles.input}
            type="text"
            placeholder="Customer Name"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
          />

          <input
            style={styles.input}
            type="text"
            placeholder="Phone Number"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
          />
        </div>

        {/* Payment Details */}
        <div style={styles.sectionBox}>
          <h3 style={styles.sectionTitle}>Payment Details</h3>

          <input
            style={styles.input}
            type="number"
            placeholder="Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />

          <input
            style={styles.input}
            type="number"
            placeholder="Discount"
            value={discount}
            onChange={(e) => setDiscount(e.target.value)}
          />

          <div style={styles.row}>
            <span><b>Total Amount:</b></span>
            <span><b>LKR {totalAmount}</b></span>
          </div>
        </div>

        {/* Payment Method */}
        <div style={styles.sectionBox}>
          <h3 style={styles.sectionTitle}>Payment Method</h3>

          <div style={styles.methodBox}>
            <label style={styles.methodLabel}>
              <input
                type="radio"
                value="CARD"
                checked={paymentMethod === "CARD"}
                onChange={() => handlePaymentMethodChange("CARD")}
              />
              Card
            </label>

            <label style={styles.methodLabel}>
              <input
                type="radio"
                value="CASH"
                checked={paymentMethod === "CASH"}
                onChange={() => handlePaymentMethodChange("CASH")}
              />
              Cash
            </label>
          </div>
        </div>

        {/* Pay Button */}
        {!clientSecret && (
          <button
            style={styles.payBtn}
            onClick={handlePayNow}
            disabled={loading}
          >
            {loading
              ? "Preparing Payment..."
              : `Pay LKR ${totalAmount} Now`}
          </button>
        )}

        {/* Stripe Form */}
        {clientSecret && (
          <div style={{ marginTop: "20px" }}>
            <Elements stripe={stripePromise} options={{ clientSecret }}>
              <CheckoutForm
                clientSecret={clientSecret}
                customerName={customerName}
                phoneNumber={phoneNumber}
                totalAmount={totalAmount}
              />
            </Elements>
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "linear-gradient(to right, #e9f6ff, #f5fbff)",
    padding: "20px",
  },
  card: {
    width: "440px",
    backgroundColor: "#fff",
    borderRadius: "18px",
    padding: "25px",
    boxShadow: "0px 8px 25px rgba(0,0,0,0.1)",
  },
  title: { fontSize: "22px", fontWeight: "bold", marginBottom: "18px" },
  sectionBox: {
    backgroundColor: "#f7fbff",
    padding: "15px",
    borderRadius: "12px",
    marginTop: "12px",
  },
  sectionTitle: {
    fontSize: "16px",
    fontWeight: "bold",
    marginBottom: "12px",
  },
  input: {
    width: "100%",
    padding: "10px",
    borderRadius: "10px",
    border: "1px solid #ccc",
    marginBottom: "10px",
  },
  row: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: "10px",
  },
  methodBox: {
    display: "flex",
    justifyContent: "space-between",
  },
  methodLabel: {
    fontSize: "14px",
    cursor: "pointer",
  },
  payBtn: {
    width: "100%",
    marginTop: "18px",
    padding: "14px",
    borderRadius: "14px",
    border: "none",
    backgroundColor: "#1fbf6b",
    color: "white",
    fontSize: "16px",
    fontWeight: "bold",
    cursor: "pointer",
  },
};