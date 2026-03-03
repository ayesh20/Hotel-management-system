import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getCustomerById, updateCustomer } from "../../api/customerApi";

export default function EditCustomer() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    nicOrPassport: "",
    address: "",
    gender: "",
    dateOfBirth: "",
  });

  useEffect(() => {
    loadCustomer();
  }, []);

  const loadCustomer = async () => {
    const res = await getCustomerById(id);
    setForm(res.data);
  };

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await updateCustomer(id, form);
    //alert("Customer updated successfully");
    navigate("/customers", { state: { message: "Guest updated successfully" } });
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
          Edit Guest
        </h2>
        <p style={{ color: "#6b7280", marginBottom: "25px" }}>
          Update guest information.
        </p>

        <form onSubmit={handleSubmit}>
          <input name="fullName" value={form.fullName} onChange={handleChange} style={inputStyle}/>
          <input type="email" name="email" value={form.email} onChange={handleChange} style={inputStyle}/>
          <input name="phone" value={form.phone} onChange={handleChange} style={inputStyle}/>
          <input name="nicOrPassport" value={form.nicOrPassport} onChange={handleChange} style={inputStyle}/>
          <input name="address" value={form.address} onChange={handleChange} style={inputStyle}/>

          <select name="gender" value={form.gender} onChange={handleChange} style={inputStyle}>
            <option value="">Select Gender</option>
            <option>Male</option>
            <option>Female</option>
          </select>

          <input
            type="date"
            name="dateOfBirth"
            value={form.dateOfBirth}
            onChange={handleChange}
            style={inputStyle}
          />

          <button style={saveBtn}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#15a74d"}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#19c75c"}
          >Update Guest</button>
        </form>
      </div>
    </div>
  );
}

const inputStyle = {
  width: "100%",
  padding: "12px",
  marginBottom: "12px",
  borderRadius: "8px",
  border: "1px solid #d1d5db",
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
};