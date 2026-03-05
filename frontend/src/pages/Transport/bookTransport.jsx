import React, { useEffect, useState } from "react";
import axios from "axios";
import { ArrowLeft } from "lucide-react";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export default function BookTransport() {

  const navigate = useNavigate();

  const CUSTOMER_URL = `${import.meta.env.VITE_BACKEND_URL_TRANSPORT_BOOKING}/customers`;
  const VEHICLE_URL = `${import.meta.env.VITE_BACKEND_URL_TRANSPORT_BOOKING}/available-vehicles`;
  const BOOKING_URL = `${import.meta.env.VITE_BACKEND_URL_TRANSPORT_BOOKING}/add`;

  const [customers, setCustomers] = useState([]);
  const [vehicles, setVehicles] = useState([]);

  const [formData, setFormData] = useState({
    customerId: "",
    vehicleId: "",
    pricePerDay: "",
    fromLocation: "",
    toLocation: ""
  });

  useEffect(() => {
    fetchCustomers();
    fetchVehicles();
  }, []);

  const fetchCustomers = async () => {
    try {
      const res = await axios.get(CUSTOMER_URL);
      setCustomers(res.data);
    } catch (error) {
      toast.error("Failed to load customers");
    }
  };

  const fetchVehicles = async () => {
    try {
      const res = await axios.get(VEHICLE_URL);
      setVehicles(res.data);
    } catch (error) {
      toast.error("Failed to load vehicles");
    }
  };

  const handleChange = (e) => {

    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value
    });

    // Auto fill price when vehicle selected
    if (name === "vehicleId") {

      const selectedVehicle = vehicles.find(v => v.id === value);

      if (selectedVehicle) {
        setFormData(prev => ({
          ...prev,
          vehicleId: value,
          pricePerDay: selectedVehicle.pricePerDay
        }));
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {

      await axios.post(BOOKING_URL, formData);

      toast.success("Transport booking successful");

      navigate("/transportBookings");

    } catch (error) {

      console.error(error);
      toast.error("Failed to book transport");

    }
  };

  return (
    <div className="min-h-screen bg-slate-100 p-6">

      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => navigate("/allTransport")}
          className="p-2 hover:bg-slate-200 rounded-lg"
        >
          <ArrowLeft className="w-6 h-6 text-slate-900" />
        </button>

        <h1 className="text-3xl font-bold text-slate-900">
          Book Transport
        </h1>
      </div>

      <div className="bg-white rounded-2xl shadow-lg p-8 max-w-3xl mx-auto">

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Customer */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Select Customer
            </label>

            <select
              name="customerId"
              value={formData.customerId}
              onChange={handleChange}
              required
              className="w-full border border-slate-300 rounded-lg p-3"
            >
              <option value="">Select Customer</option>

              {customers.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.fullName}
                </option>
              ))}

            </select>
          </div>

          {/* Vehicle */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Select Vehicle
            </label>

            <select
              name="vehicleId"
              value={formData.vehicleId}
              onChange={handleChange}
              required
              className="w-full border border-slate-300 rounded-lg p-3"
            >
              <option value="">Select Vehicle</option>

              {vehicles.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.vehicleType}
                </option>
              ))}

            </select>
          </div>

          {/* Price */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Price Per Day
            </label>

            <input
              type="text"
              value={formData.pricePerDay}
              readOnly
              className="w-full border border-slate-300 rounded-lg p-3 bg-slate-100"
            />
          </div>

          {/* From */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              From Location
            </label>

            <input
              type="text"
              name="fromLocation"
              value={formData.fromLocation}
              onChange={handleChange}
              required
              className="w-full border border-slate-300 rounded-lg p-3"
              placeholder="Enter pickup location"
            />
          </div>

          {/* To */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              To Location
            </label>

            <input
              type="text"
              name="toLocation"
              value={formData.toLocation}
              onChange={handleChange}
              required
              className="w-full border border-slate-300 rounded-lg p-3"
              placeholder="Enter destination"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-green-500 hover:bg-green-600 text-white py-3 rounded-lg font-semibold cursor-pointer"
          >
            Confirm Booking
          </button>

        </form>

      </div>

    </div>
  );
}