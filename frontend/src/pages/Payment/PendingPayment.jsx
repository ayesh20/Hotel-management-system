import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function PendingPayment() {
  const location = useLocation();
  const navigate = useNavigate();
  const data = location.state || {};

  const formatDate = (dateStr) => {
    if (!dateStr) return new Date().toLocaleString();
    return new Date(dateStr).toLocaleString();
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        {/* Header */}
        <div style={styles.header}>
          <div style={styles.iconCircle}>⏳</div>
          <h2 style={styles.title}>Payment Pending</h2>
          <p style={styles.subtitle}>Please pay at the front desk counter</p>
        </div>

        {/* Warning Banner */}
        <div style={styles.warningBanner}>
          <span style={{ fontSize: "18px" }}>🏨</span>
          <span>Please complete your payment at the hotel reception counter to confirm your booking.</span>
        </div>

        {/* Receipt */}
        <div style={styles.receiptBox}>
          <h3 style={styles.receiptTitle}>Payment Receipt</h3>

          <div style={styles.receiptRow}>
            <span style={styles.receiptLabel}>Customer Name</span>
            <span style={styles.receiptValue}>{data.customerName || "N/A"}</span>
          </div>

          <div style={styles.receiptRow}>
            <span style={styles.receiptLabel}>Phone Number</span>
            <span style={styles.receiptValue}>{data.phoneNumber || "N/A"}</span>
          </div>

          <div style={styles.divider} />

          <div style={styles.receiptRow}>
            <span style={styles.receiptLabel}>Amount</span>
            <span style={styles.receiptValue}>LKR {data.amount?.toFixed?.(2) || "0.00"}</span>
          </div>

          <div style={styles.receiptRow}>
            <span style={styles.receiptLabel}>Discount</span>
            <span style={styles.receiptValue}>- LKR {data.discount?.toFixed?.(2) || "0.00"}</span>
          </div>

          <div style={styles.totalRow}>
            <span style={{ fontWeight: "700", fontSize: "16px" }}>Total Due</span>
            <span style={{ fontWeight: "700", fontSize: "18px", color: "#f59e0b" }}>
              LKR {data.totalAmount?.toFixed?.(2) || "0.00"}
            </span>
          </div>

          <div style={styles.divider} />

          <div style={styles.receiptRow}>
            <span style={styles.receiptLabel}>Payment Method</span>
            <span style={{ ...styles.receiptValue, color: "#f59e0b", fontWeight: "600" }}>Cash (Pending)</span>
          </div>

          {data.paymentId && (
            <div style={styles.receiptRow}>
              <span style={styles.receiptLabel}>Payment ID</span>
              <span style={{ ...styles.receiptValue, fontSize: "12px", color: "#94a3b8" }}>
                {data.paymentId}
              </span>
            </div>
          )}

          <div style={styles.receiptRow}>
            <span style={styles.receiptLabel}>Date</span>
            <span style={styles.receiptValue}>{formatDate(data.paymentDate)}</span>
          </div>

          <div style={styles.receiptRow}>
            <span style={styles.receiptLabel}>Status</span>
            <span style={styles.pendingBadge}>⏳ PENDING</span>
          </div>
        </div>

        {/* Actions */}
        <button style={styles.dashboardBtn} onClick={() => navigate("/dashboard")}>
          ← Back to Dashboard
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
    background: "linear-gradient(135deg, #fffbeb 0%, #fef3c7 50%, #fff7ed 100%)",
    padding: "20px",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
  card: {
    width: "460px",
    backgroundColor: "#fff",
    borderRadius: "20px",
    padding: "30px",
    boxShadow: "0px 10px 40px rgba(0,0,0,0.08)",
  },
  header: {
    textAlign: "center",
    marginBottom: "20px",
  },
  iconCircle: {
    width: "70px",
    height: "70px",
    borderRadius: "50%",
    backgroundColor: "#fef3c7",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "34px",
    margin: "0 auto 12px auto",
    border: "3px solid #fbbf24",
  },
  title: {
    fontSize: "24px",
    fontWeight: "bold",
    color: "#92400e",
    margin: "0 0 6px 0",
  },
  subtitle: {
    fontSize: "14px",
    color: "#b45309",
    margin: 0,
  },
  warningBanner: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: "14px 16px",
    backgroundColor: "#fffbeb",
    border: "1px solid #fde68a",
    borderRadius: "12px",
    fontSize: "13px",
    color: "#92400e",
    marginBottom: "18px",
    lineHeight: "1.5",
  },
  receiptBox: {
    backgroundColor: "#fafafa",
    padding: "20px",
    borderRadius: "14px",
    border: "1px solid #e5e7eb",
  },
  receiptTitle: {
    fontSize: "14px",
    fontWeight: "700",
    color: "#6b7280",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
    marginBottom: "14px",
  },
  receiptRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "6px 0",
  },
  receiptLabel: {
    fontSize: "13px",
    color: "#6b7280",
  },
  receiptValue: {
    fontSize: "14px",
    fontWeight: "500",
    color: "#1e293b",
  },
  totalRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "12px 16px",
    backgroundColor: "#fffbeb",
    borderRadius: "10px",
    border: "1px solid #fde68a",
    marginTop: "8px",
  },
  divider: {
    height: "1px",
    backgroundColor: "#e5e7eb",
    margin: "10px 0",
  },
  pendingBadge: {
    display: "inline-block",
    padding: "4px 12px",
    backgroundColor: "#fef3c7",
    color: "#92400e",
    borderRadius: "20px",
    fontSize: "12px",
    fontWeight: "700",
  },
  dashboardBtn: {
    width: "100%",
    marginTop: "20px",
    padding: "14px",
    borderRadius: "14px",
    border: "2px solid #e5e7eb",
    backgroundColor: "#fff",
    color: "#374151",
    fontSize: "15px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.2s",
  },
};