import React, { useEffect, useState } from "react";
import { getCustomers, deleteCustomer } from "../../api/customerApi";
import { useNavigate } from "react-router-dom";
import { FaEdit, FaTrash } from "react-icons/fa";
import { useLocation } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";

const AllCustomers = () => {
  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true); //new
  const location = useLocation(); 
  const [success, setSuccess] = useState(location.state?.message || "");
  const navigate = useNavigate();

  const filtered = customers.filter((c) =>
    (c.fullName || "").toLowerCase().includes(search.toLowerCase()) ||
    (c.email || "").toLowerCase().includes(search.toLowerCase()) ||
    (c.phone || "").toLowerCase().includes(search.toLowerCase()) ||
    (c.nicOrPassport || "").toLowerCase().includes(search.toLowerCase())
  );

  const loadCustomers = async () => {
  try {
    const res = await getCustomers();
    setCustomers(res.data);
  } catch (error) {
    console.error("Error loading customers", error);
  } finally {
    setLoading(false);
  }
 };

  useEffect(() => {
    loadCustomers();
  }, []);

  useEffect(() => {
  if (location.state?.message) {
    window.history.replaceState({}, document.title);
  }
}, []);

useEffect(() => {
  if (success) {
    const timer = setTimeout(() => setSuccess(""), 3000);
    return () => clearTimeout(timer);
  }
}, [success]);

  const handleDelete = async (id) => {
    if (window.confirm("Delete this guest?")) {
      await deleteCustomer(id);
      setSuccess("Guest deleted successfully");
      loadCustomers();
    }
  };

  const thStyle = {
  textAlign: "left",
  padding: "14px",
  color: "#374151",
  fontWeight: "600",
  fontSize: "14px"
};

const tdStyle = {
  padding: "14px",
  borderBottom: "1px solid #e5e7eb"
};

  return (
  <div
    style={{
      backgroundColor: "#f4f6f9",
      minHeight: "100vh",
      padding: "40px 0",
    }}
  >
    <div
      style={{
        width: "90%",
        maxWidth: "1200px",
        margin: "auto",
      }}
    >
    
    {/* PAGE TITLE */}
    <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "10px" }}>
      <div style={{ position: "relative", display: "inline-block" }}>
        
        <FaArrowLeft
          onClick={() => navigate("/dashboard")}
          style={{
            cursor: "pointer",
            fontSize: "20px",
            transition: "0.2s ease"
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.transform = "scale(1.15)";
            e.currentTarget.style.color = "#656866";
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = "scale(1)";
            e.currentTarget.style.color = "black";
          }}
          title="Go to dashboard"
        />
      </div>

      <h1
        style={{
          margin: 0,
          fontSize: "32px",
          fontWeight: "700",
          color: "#1f2937",
          letterSpacing: "0.3px"
        }}
      >
        Guests / Customers
      </h1>
    </div>

    <p style={{ color: "#6b7280", marginBottom: "25px" }}>
      Manage and maintain guest information efficiently.
    </p>

    {/* ADD GUEST BUTTON */}
    <button
      onClick={() => navigate("/customers/add")}
      style={{
        backgroundColor: "#16c172",
        color: "white",
        padding: "16px 32px",
        border: "none",
        borderRadius: "12px",
        fontSize: "16px",
        fontWeight: "600",
        cursor: "pointer",
        marginBottom: "30px",
        boxShadow: "0 6px 16px rgba(22,193,114,0.25)",
        transition: "0.2s ease"
      }}
      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#109443"}
      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#19c75c"}
    >
      + Add Guest
    </button>

        {/* SEARCH INPUT */}
    <div style={{ margin: "20px 0" }}>
        <input
            type="text"
            placeholder="🔍 Search guests..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
            width: "100%",
            maxWidth: "350px",
            padding: "10px 14px",
            borderRadius: "8px",
            border: "1px solid #d1d5db",
            outline: "none"
            }}
        />
    </div>

  {/* success message */}
    {success && (
        <div
            style={{
            background: "#dcfce7",
            color: "#166534",
            padding: "12px",
            borderRadius: "8px",
            marginBottom: "15px",
            fontWeight: "500"
            }}
        >
            {success}
        </div>
    )}

    {/* WHITE CARD CONTAINER */}
    <div
      style={{
        background: "white",
        borderRadius: "16px",
        padding: "25px",
        boxShadow: "0 10px 30px rgba(0,0,0,0.06)"
    }}
    >
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", minWidth: "900px", borderCollapse: "separate", borderSpacing: "0 8px" }}>
          <thead>
            <tr style={{ borderBottom: "2px solid #e5e7eb" }}>
              <th style={thStyle}>Name</th>
              <th style={thStyle}>Email</th>
              <th style={thStyle}>Phone</th>
              <th style={thStyle}>NIC / Passport</th>
              <th style={thStyle}>Address</th>
              <th style={thStyle}>DOB</th>
              <th style={thStyle}>Gender</th>
              <th style={thStyle}>Action</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan="8" style={{ textAlign: "center", padding: "30px" }}>
                  Loading guests...
                </td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan="8" style={{ textAlign: "center", padding: "30px", color: "#6b7280" }}>
                  No guests found
                </td>
              </tr>
            ) : (
                  filtered.map((c) => (
              <tr key={c.id}>
                <td style={tdStyle}>{c.fullName}</td>
                <td style={tdStyle}>{c.email}</td>
                <td style={tdStyle}>{c.phone}</td>
                <td style={tdStyle}>{c.nicOrPassport}</td>
                <td style={tdStyle}>{c.address}</td>
                <td style={tdStyle}>{c.dateOfBirth}</td>
                <td style={tdStyle}>{c.gender}</td>
                <td style={{ paddingLeft: "20px", whiteSpace: "nowrap", borderBottom: "1px solid #e5e7eb" }}>
                  <button
                    title="Edit Guest"
                    onClick={() => navigate(`/customers/edit/${c.id}`)}
                    style={{
                      marginRight: "14px",
                      border: "none",
                      background: "transparent",
                      cursor: "pointer"
                    }}
                  >
                    <FaEdit
                      style={{ marginRight: "14px" }}
                      onMouseEnter={e => e.currentTarget.style.color="#2563eb"}
                      onMouseLeave={e => e.currentTarget.style.color="black"}
                    />
                  </button>

                  <button
                    title="Delete Guest"
                    onClick={() => handleDelete(c.id)}
                    style={{
                      border: "none",
                      background: "transparent",
                      cursor: "pointer"
                    }}
                  >
                    <FaTrash
                      onMouseEnter={e => e.currentTarget.style.color="#dc2626"}
                      onMouseLeave={e => e.currentTarget.style.color="black"}
                    />
                  </button>
                </td>
              </tr>
            ))
          )}
          </tbody>
        </table>
      </div>
   </div>
  </div>
 </div>
 );
};

export default AllCustomers;