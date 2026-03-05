import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import CheckoutForm from "./CheckoutForm.jsx";
import { createStripeIntent } from "../../api/paymentApi.js"; 

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PK);

export default function Payment() {
  const navigate = useNavigate();
  const location = useLocation();

  // 🔥 BULLETPROOF FIX: Check location state first, then fallback to Session Storage
  const sessionString = sessionStorage.getItem('pendingPaymentData');
  const sessionData = sessionString ? JSON.parse(sessionString) : {};
  const reservationData = location.state || sessionData;

  const [customerName, setCustomerName] = useState(reservationData.customerName || "");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [amount, setAmount] = useState(reservationData.totalPrice ? String(reservationData.totalPrice) : "");
  const [discount, setDiscount] = useState("0");
  const [paymentMethod, setPaymentMethod] = useState("CARD");

  const [clientSecret, setClientSecret] = useState("");
  const [loading, setLoading] = useState(false);

  const totalAmount = (parseFloat(amount || 0) - parseFloat(discount || 0)).toFixed(2);

  const handlePaymentMethodChange = (method) => {
    setPaymentMethod(method);
    setClientSecret("");
  };

  const handlePayNow = async () => {
    
    // SAFETY CHECK
    if (!reservationData.reservationId || !reservationData.customerId) {
        alert("System Error: Booking ID or Customer ID is missing. Please go back and create the reservation again.");
        return;
    }

    if (!customerName || !phoneNumber || !amount) {
      alert("Please fill Customer Name, Phone Number and Amount!");
      return;
    }

    const finalAmountCents = Math.round(parseFloat(totalAmount) * 100);

    // ─── CASH PAYMENT ──────────────────────────────────────────────
    if (paymentMethod === "CASH") {
      setLoading(true);
      try {
        const payload = {
          customerName: customerName,
          phoneNumber: phoneNumber,
          customerId: reservationData.customerId,
          bookingId: reservationData.reservationId, 
          amount: parseFloat(amount),
          discountAmount: parseFloat(discount || 0),
          totalAmount: parseFloat(totalAmount) 
        };

        const paymentUrl = "http://13.212.144.21:8082/api/payments";
        const response = await axios.post(paymentUrl, payload);

        // Clear the session storage so it doesn't get stuck for the next user
        sessionStorage.removeItem('pendingPaymentData');

        navigate("/pendingpayment", {
          state: {
            customerName,
            phoneNumber,
            amount: parseFloat(amount),
            discount: parseFloat(discount || 0),
            totalAmount: parseFloat(totalAmount),
            paymentId: response.data.paymentId,
            paymentDate: response.data.paymentDate,
          },
        });
      } catch (error) {
        console.error("Payment Error:", error);
        alert("Failed to create payment. Please try again.");
      } finally {
        setLoading(false);
      }
      return;
    }

    // ─── CARD PAYMENT (STRIPE) ─────────────────────────────────────
    if (paymentMethod === "CARD") {
      setLoading(true);
      try {
        const response = await createStripeIntent({
          amount: finalAmountCents,
          currency: "usd",
          description: "Hotel Booking Payment",
        });

        setClientSecret(response.data.clientSecret);
      } catch (error) {
        alert("Stripe initialization failed. Please try again.");
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>💳 Payment</h2>

        {/* Customer Details */}
        <div style={styles.sectionBox}>
          <h3 style={styles.sectionTitle}>Customer Details</h3>

          <label style={styles.label}>Customer Name</label>
          <input
            style={styles.input}
            type="text"
            placeholder="Enter customer name"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            readOnly={!!reservationData.customerName}
          />

          <label style={styles.label}>Phone Number</label>
          <input
            style={styles.input}
            type="text"
            placeholder="Enter phone number"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
          />
        </div>

        {/* Payment Details */}
        <div style={styles.sectionBox}>
          <h3 style={styles.sectionTitle}>Payment Details</h3>

          <label style={styles.label}>Amount (LKR)</label>
          <input
            style={styles.input}
            type="number"
            placeholder="Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            readOnly={!!reservationData.totalPrice}
          />

          <label style={styles.label}>Discount (LKR)</label>
          <input
            style={styles.input}
            type="number"
            placeholder="Discount"
            value={discount}
            onChange={(e) => setDiscount(e.target.value)}
          />

          <div style={styles.totalRow}>
            <span style={{ fontSize: "16px", fontWeight: "600" }}>Total Amount:</span>
            <span style={{ fontSize: "18px", fontWeight: "bold", color: "#1fbf6b" }}>
              LKR {totalAmount}
            </span>
          </div>
        </div>

        {/* Payment Method */}
        <div style={styles.sectionBox}>
          <h3 style={styles.sectionTitle}>Payment Method</h3>

          <div style={styles.methodBox}>
            <label
              style={{
                ...styles.methodCard,
                border: paymentMethod === "CARD" ? "2px solid #1fbf6b" : "2px solid #e2e8f0",
                backgroundColor: paymentMethod === "CARD" ? "#f0fdf4" : "#fff",
              }}
            >
              <input type="radio" value="CARD" checked={paymentMethod === "CARD"} onChange={() => handlePaymentMethodChange("CARD")} style={{ display: "none" }} />
              <span style={{ fontSize: "22px" }}>💳</span>
              <span style={{ fontWeight: "600", fontSize: "14px" }}>Card</span>
            </label>

            <label
              style={{
                ...styles.methodCard,
                border: paymentMethod === "CASH" ? "2px solid #1fbf6b" : "2px solid #e2e8f0",
                backgroundColor: paymentMethod === "CASH" ? "#f0fdf4" : "#fff",
              }}
            >
              <input type="radio" value="CASH" checked={paymentMethod === "CASH"} onChange={() => handlePaymentMethodChange("CASH")} style={{ display: "none" }} />
              <span style={{ fontSize: "22px" }}>💵</span>
              <span style={{ fontWeight: "600", fontSize: "14px" }}>Cash</span>
            </label>
          </div>
        </div>

        {/* Pay Button */}
        {!clientSecret && (
          <button
            style={{ ...styles.payBtn, opacity: loading ? 0.7 : 1 }}
            onClick={handlePayNow}
            disabled={loading}
          >
            {loading ? "Processing..." : `Pay LKR ${totalAmount} Now`}
          </button>
        )}

        {/* Stripe Card Form */}
        {clientSecret && (
          <div style={{ marginTop: "20px" }}>
            <Elements stripe={stripePromise} options={{ clientSecret }}>
              <CheckoutForm
                clientSecret={clientSecret}
                bookingId={reservationData.reservationId} 
                customerId={reservationData.customerId}   
                customerName={customerName}
                phoneNumber={phoneNumber}
                amount={parseFloat(amount)}
                discount={parseFloat(discount || 0)}
                totalAmount={parseFloat(totalAmount)}
              />
            </Elements>
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: { minHeight: "100vh", display: "flex", justifyContent: "center", alignItems: "center", background: "linear-gradient(135deg, #e9f6ff 0%, #f5fbff 50%, #eef9f1 100%)", padding: "20px", fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif" },
  card: { width: "460px", backgroundColor: "#fff", borderRadius: "20px", padding: "30px", boxShadow: "0px 10px 40px rgba(0,0,0,0.08)" },
  title: { fontSize: "24px", fontWeight: "bold", marginBottom: "20px", color: "#1e293b" },
  sectionBox: { backgroundColor: "#f8fafc", padding: "18px", borderRadius: "14px", marginTop: "14px", border: "1px solid #e2e8f0" },
  sectionTitle: { fontSize: "15px", fontWeight: "700", marginBottom: "12px", color: "#475569", textTransform: "uppercase", letterSpacing: "0.5px" },
  label: { display: "block", fontSize: "13px", fontWeight: "600", color: "#64748b", marginBottom: "4px", marginTop: "8px" },
  input: { width: "100%", padding: "11px 14px", borderRadius: "10px", border: "1.5px solid #d1d5db", marginBottom: "6px", fontSize: "14px", outline: "none", boxSizing: "border-box", transition: "border-color 0.2s" },
  totalRow: { display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "14px", padding: "10px 14px", backgroundColor: "#f0fdf4", borderRadius: "10px", border: "1px solid #bbf7d0" },
  methodBox: { display: "flex", gap: "12px" },
  methodCard: { flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: "6px", padding: "16px 10px", borderRadius: "12px", cursor: "pointer", transition: "all 0.2s" },
  payBtn: { width: "100%", marginTop: "20px", padding: "15px", borderRadius: "14px", border: "none", backgroundColor: "#1fbf6b", color: "white", fontSize: "16px", fontWeight: "bold", cursor: "pointer", transition: "background-color 0.2s", boxShadow: "0 4px 14px rgba(31, 191, 107, 0.3)" },
};