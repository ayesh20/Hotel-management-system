import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

export default function PaymentComplete() {
  const { id } = useParams(); // Get paymentId from URL
  const navigate = useNavigate();
  const [payment, setPayment] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch payment details from backend
    axios
      .get(`http://localhost:8082/api/payments/${id}`)
      .then((res) => {
        setPayment(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.card}>Loading payment details...</div>
      </div>
    );
  }

  if (!payment) {
    return (
      <div style={styles.container}>
        <div style={styles.card}>
          <h2>No Payment Data Found</h2>
          <button style={styles.backBtn} onClick={() => navigate("/payment")}>
            Back to Payment Page
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Payment Complete</h2>

        <div style={styles.successIcon}>✔</div>

        <div style={styles.statusBox}>
          <p style={styles.statusText}>Payment Status:</p>
          <h1 style={styles.paidText}>{payment.paymentStatus}</h1>
        </div>

        <div style={styles.sectionBox}>
          <h3 style={styles.sectionTitle}>Customer Details</h3>
          <p>
            <b>Customer Name:</b> {payment.customerName}
          </p>
          <p>
            <b>Phone Number:</b> {payment.phoneNumber}
          </p>
          <p>
            <b>Booking ID:</b> {payment.bookingId}
          </p>
        </div>

        <div style={styles.sectionBox}>
          <h3 style={styles.sectionTitle}>Transaction Details</h3>
          <p>
            <b>Transaction ID:</b> {payment.transactionId}
          </p>
          <p>
            <b>Payment Date:</b> {payment.paymentDate}
          </p>
          <p>
            <b>Payment Method:</b> {payment.paymentMethod}
          </p>
        </div>

        <div style={styles.sectionBox}>
          <h3 style={styles.sectionTitle}>Payment Summary</h3>

          <div style={styles.row}>
            <span>Amount</span>
            <span>LKR {payment.amount}</span>
          </div>

          <div style={styles.row}>
            <span>Discount</span>
            <span>LKR {payment.discountAmount}</span>
          </div>

          <div style={{ ...styles.row, ...styles.totalRow }}>
            <span>Total Paid</span>
            <span>LKR {payment.totalAmount}</span>
          </div>
        </div>

        <div style={styles.buttonRow}>
          <button style={styles.downloadBtn}>Download PDF</button>
          <button style={styles.backBtn} onClick={() => navigate("/payment")}>
            Back to Payment
          </button>
        </div>
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
    width: "430px",
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
  successIcon: {
    width: "65px",
    height: "65px",
    backgroundColor: "#1fbf6b",
    color: "white",
    fontSize: "32px",
    fontWeight: "bold",
    borderRadius: "50%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    margin: "10px auto",
  },
  statusBox: {
    border: "2px solid #1fbf6b",
    borderRadius: "12px",
    padding: "15px",
    textAlign: "center",
    marginTop: "10px",
  },
  statusText: {
    margin: "0",
    fontSize: "14px",
    color: "#555",
  },
  paidText: {
    margin: "5px 0 0 0",
    color: "#1fbf6b",
    fontSize: "28px",
  },
  sectionBox: {
    backgroundColor: "#f7fbff",
    padding: "15px",
    borderRadius: "12px",
    marginTop: "15px",
    fontSize: "14px",
    color: "#333",
    lineHeight: "1.8",
  },
  sectionTitle: {
    fontSize: "16px",
    fontWeight: "bold",
    marginBottom: "12px",
  },
  row: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "8px",
    fontSize: "14px",
  },
  totalRow: {
    fontWeight: "bold",
    fontSize: "15px",
  },
  buttonRow: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: "18px",
  },
  downloadBtn: {
    padding: "10px 18px",
    borderRadius: "12px",
    border: "2px solid #1fbf6b",
    backgroundColor: "transparent",
    cursor: "pointer",
    fontWeight: "bold",
  },
  backBtn: {
    padding: "10px 18px",
    borderRadius: "12px",
    border: "none",
    backgroundColor: "#ddd",
    cursor: "pointer",
    fontWeight: "bold",
  },
};
