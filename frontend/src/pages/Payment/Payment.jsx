import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Payment() {
  const navigate = useNavigate();

  const [customerName, setCustomerName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");
  const [amount, setAmount] = useState("");
  const [discount, setDiscount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("CARD");

  // Card Details (Only if CARD)
  const [cardNumber, setCardNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");
  const [nameOnCard, setNameOnCard] = useState("");

  const totalAmount =
    (parseFloat(amount || 0) - parseFloat(discount || 0)).toFixed(2);

  // Clear Card Inputs if not CARD
  const handlePaymentMethodChange = (method) => {
    setPaymentMethod(method);

    if (method !== "CARD") {
      setCardNumber("");
      setExpiryDate("");
      setCvv("");
      setNameOnCard("");
    }
  };

  const handlePayNow = async () => {
    if (!customerName || !phoneNumber || !amount) {
      alert("Please fill Customer Name, Phone Number and Amount!");
      return;
    }

    // Validation only for Card
    if (paymentMethod === "CARD") {
      if (!cardNumber || !expiryDate || !cvv || !nameOnCard) {
        alert("Please fill all Card Details!");
        return;
      }
    }

    const paymentData = {
      customerName: customerName,
      phoneNumber: phoneNumber,
      amount: parseFloat(amount),
      discountAmount: parseFloat(discount || 0),
      totalAmount: parseFloat(totalAmount),
      paymentMethod: paymentMethod,

      // Card data only if card
      cardDetails:
        paymentMethod === "CARD"
          ? {
              cardNumber: cardNumber,
              expiryDate: expiryDate,
              cvv: cvv,
              nameOnCard: nameOnCard,
            }
          : null,
    };

    try {
      const response = await fetch("http://localhost:8082/api/payments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(paymentData),
      });

      if (!response.ok) {
        throw new Error("Payment Failed!");
      }

      const result = await response.json();

      // Navigate to PaymentComplete page
      navigate("/paymentcomplete", { state: { payment: result } });
    } catch (error) {
      alert("Error: " + error.message);
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

          <input
            style={styles.input}
            type="text"
            placeholder="Address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
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

            <label style={styles.methodLabel}>
              <input
                type="radio"
                value="ONLINE"
                checked={paymentMethod === "ONLINE"}
                onChange={() => handlePaymentMethodChange("ONLINE")}
              />
              Online
            </label>
          </div>

          {/* Card Inputs Show only if CARD */}
          {paymentMethod === "CARD" && (
            <div style={styles.cardForm}>
              <input
                style={styles.input}
                type="text"
                placeholder="Card Number"
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value)}
              />

              <div style={styles.twoInput}>
                <input
                  style={styles.input}
                  type="text"
                  placeholder="Expiry Date (MM/YY)"
                  value={expiryDate}
                  onChange={(e) => setExpiryDate(e.target.value)}
                />

                <input
                  style={styles.input}
                  type="password"
                  placeholder="CVV"
                  value={cvv}
                  onChange={(e) => setCvv(e.target.value)}
                />
              </div>

              <input
                style={styles.input}
                type="text"
                placeholder="Name on Card"
                value={nameOnCard}
                onChange={(e) => setNameOnCard(e.target.value)}
              />
            </div>
          )}

          {/* Cash Note */}
          {paymentMethod === "CASH" && (
            <p style={styles.noteText}>
              Cash payment selected. Please pay at the counter.
            </p>
          )}

          {/* Online Note */}
          {paymentMethod === "ONLINE" && (
            <p style={styles.noteText}>
              Online payment selected. You will be redirected to payment gateway.
            </p>
          )}
        </div>

        <button style={styles.payBtn} onClick={handlePayNow}>
          Pay LKR {totalAmount} Now
        </button>
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
    fontFamily: "Arial, sans-serif",
    padding: "20px",
  },

  card: {
    width: "440px",
    backgroundColor: "#fff",
    borderRadius: "18px",
    padding: "25px",
    boxShadow: "0px 8px 25px rgba(0,0,0,0.1)",
  },

  title: {
    fontSize: "22px",
    fontWeight: "bold",
    marginBottom: "18px",
  },

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
    fontSize: "14px",
    outline: "none",
  },

  row: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: "10px",
    fontSize: "15px",
    color: "#333",
  },

  methodBox: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "10px",
  },

  methodLabel: {
    fontSize: "14px",
    cursor: "pointer",
  },

  cardForm: {
    marginTop: "10px",
  },

  twoInput: {
    display: "flex",
    gap: "10px",
  },

  noteText: {
    fontSize: "13px",
    color: "#555",
    marginTop: "10px",
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
