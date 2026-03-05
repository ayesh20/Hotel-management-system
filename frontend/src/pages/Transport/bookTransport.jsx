import React, { useEffect, useState } from "react";
import axios from "axios";

const BOOKING_URL = import.meta.env.VITE_BACKEND_URL_TRANSPORT_BOOKING;
const CUSTOMER_URL = import.meta.env.VITE_BACKEND_URL_CUSTOMER;
const TRANSPORT_URL = import.meta.env.VITE_BACKEND_URL_TRANSPORT;

function BookTransport() {

  const [customers, setCustomers] = useState([]);
  const [vehicles, setVehicles] = useState([]);

  const [form, setForm] = useState({
    customerId: "",
    vehicleId: "",
    fromLocation: "",
    toLocation: ""
  });

  const [price, setPrice] = useState(0);

  useEffect(() => {
    fetchCustomers();
    fetchVehicles();
  }, []);

  const fetchCustomers = async () => {
    const res = await axios.get(CUSTOMER_URL);
    setCustomers(res.data);
  };

  const fetchVehicles = async () => {
    const res = await axios.get(`${TRANSPORT_URL}/available`);
    setVehicles(res.data);
  };

  const handleVehicleChange = (id) => {
    const selected = vehicles.find(v => v.id === id);

    setForm({
      ...form,
      vehicleId: id
    });

    if (selected) {
      setPrice(selected.pricePerDay);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const bookingData = {
      ...form
    };

    await axios.post(BOOKING_URL, bookingData);

    alert("Booking Created Successfully!");

    setForm({
      customerId: "",
      vehicleId: "",
      fromLocation: "",
      toLocation: ""
    });

    setPrice(0);

    fetchVehicles();
  };

  return (
    <div className="container mt-4">

      <h2>Book Transport</h2>

      <form onSubmit={handleSubmit}>

        {/* Customer */}
        <div className="mb-3">
          <label>Customer</label>
          <select
            className="form-control"
            value={form.customerId}
            onChange={(e)=>setForm({...form, customerId:e.target.value})}
          >
            <option>Select Customer</option>

            {customers.map(c => (
              <option key={c.id} value={c.id}>
                {c.fullName}
              </option>
            ))}

          </select>
        </div>

        {/* Vehicle */}
        <div className="mb-3">
          <label>Vehicle</label>
          <select
            className="form-control"
            value={form.vehicleId}
            onChange={(e)=>handleVehicleChange(e.target.value)}
          >

            <option>Select Vehicle</option>

            {vehicles.map(v => (
              <option key={v.id} value={v.id}>
                {v.vehicleType} - {v.vehicleNumber}
              </option>
            ))}

          </select>
        </div>

        {/* Price */}
        <div className="mb-3">
          <label>Price Per Day</label>
          <input
            className="form-control"
            value={price}
            readOnly
          />
        </div>

        {/* From */}
        <div className="mb-3">
          <label>From</label>
          <input
            className="form-control"
            value={form.fromLocation}
            onChange={(e)=>setForm({...form, fromLocation:e.target.value})}
          />
        </div>

        {/* To */}
        <div className="mb-3">
          <label>To</label>
          <input
            className="form-control"
            value={form.toLocation}
            onChange={(e)=>setForm({...form, toLocation:e.target.value})}
          />
        </div>

        <button className="btn btn-success">
          Confirm Booking
        </button>

      </form>

    </div>
  );
}

export default BookTransport;