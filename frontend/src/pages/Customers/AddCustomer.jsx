import React, { useState } from "react";
import { addCustomer } from "../../api/customerApi";
import { useNavigate } from "react-router-dom";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

const AddCustomer = () => {
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    nicOrPassport: "",
    address: "",
    gender: "",
    dateOfBirth: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await addCustomer(form);
    navigate("/customers", { state: { message: "Guest added successfully" } });
  };

  const inputStyle = {
  width: "100%",
  padding: "12px",
  marginBottom: "12px",
  borderRadius: "8px",
  border: "1px solid #d1d5db",
  fontSize: "14px"
};

const saveBtn = {
  width: "100%",
  padding: "14px",
  borderRadius: "10px",
  border: "none",
  backgroundColor: "#16c172",
  color: "white",
  fontSize: "16px",
  fontWeight: "600",
  cursor: "pointer",
  marginTop: "10px"
};

const input = (placeholder, name) => (
  <input
    name={name}
    placeholder={placeholder}
    onChange={handleChange}
    required
    style={inputStyle}
  />
);

const handleClear = () => {
  setForm({
    fullName: "",
    email: "",
    countryCode: "+94",
    phone: "",
    nicOrPassport: "",
    address: "",
    gender: "",
    dateOfBirth: "",
  });
};

  return (
    <div style={{ background: "#f4f6f9", minHeight: "100vh", padding: "40px" }}>
      <div
       style={{
         maxWidth: "700px",
         margin: "auto",
         background: "white",
         padding: "30px",
         borderRadius: "16px",
         boxShadow: "0 8px 25px rgba(0,0,0,0.05)"
      }}
     >
      <h2 style={{
        fontSize: "26px",
        fontWeight: "700",
        color: "#1f2937",
        marginBottom: "6px"
      }}>
        Add Guest
      </h2>
      <p style={{ color: "#6b7280", marginBottom: "25px" }}>
        Enter guest details to create a new record.
      </p>

      <form onSubmit={handleSubmit}>
        <input
            name="fullName"
            placeholder="Full Name"
            onChange={handleChange}
            value={form.fullName}
            required
            style={inputStyle}
        />
        
        <input
            type="email"
            name="email"
            placeholder="Email"
            onChange={handleChange}
            value={form.email}
            required
            style={inputStyle}
        />

        <PhoneInput
            country={"lk"}   // Sri Lanka default
            value={form.phone}
            onChange={(phone) => setForm({ ...form, phone })}
            inputStyle={{
                width: "100%",
                height: "45px",
                borderRadius: "8px",
                border: "1px solid #d1d5db" //new
            }}
                containerStyle={{ marginBottom: "12px" }}
        />

        <input
            name="nicOrPassport"
            placeholder="NIC / Passport"
            onChange={handleChange}
            value={form.nicOrPassport}
            required
            style={inputStyle}
        />

        <input
            name="address"
            placeholder="Address"
            onChange={handleChange}
            value={form.address}
            style={inputStyle}
        />

        <select
            name="gender"
            value={form.gender}
            onChange={handleChange}
            required
            style={inputStyle}
            >
            <option value="">Select Gender</option>
            <option>Male</option>
            <option>Female</option>
        </select>

        <input
            type="date"
            name="dateOfBirth"
            value={form.dateOfBirth}
            onChange={handleChange}
            required
            style={inputStyle}
        />

        <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
            <button type="submit" style={saveBtn}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#15a74d"}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#19c75c"}
            >
                Save Guest
            </button>

            <button
                type="button"
                onClick={handleClear}
                style={{
                ...saveBtn,
                backgroundColor: "#e5e7eb",
                color: "#111",
                }}
             onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#d3d3d6"}
             onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#e5e7eb"}   
            >
                Clear
            </button>
        </div>
       </form>
      </div>
    </div>
 );
};

export default AddCustomer;