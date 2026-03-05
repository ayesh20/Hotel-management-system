import React, { useEffect, useState } from "react";
import { ArrowLeft, Save } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";

const BOOKING_URL = import.meta.env.VITE_BACKEND_URL_TRANSPORT_BOOKING;

export default function EditBookingTransport() {

  const { id } = useParams();
  const navigate = useNavigate();

  const [booking, setBooking] = useState({
    customerName: "",
    vehicleType: "",
    pricePerDay: "",
    fromLocation: "",
    toLocation: "",
    bookingDate: ""
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBooking();
  }, []);

  const fetchBooking = async () => {
    try {
      const res = await axios.get(`${BOOKING_URL}`);
      const found = res.data.find((b) => b.bookingId === id);

      if (!found) {
        toast.error("Booking not found");
        navigate("/viewBookings");
        return;
      }

      setBooking(found);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load booking");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setBooking({
      ...booking,
      [e.target.name]: e.target.value
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      await axios.put(`${BOOKING_URL}/${id}`, {
        fromLocation: booking.fromLocation,
        toLocation: booking.toLocation
      });

      toast.success("Booking updated successfully");
      navigate("/transportBookings");

    } catch (error) {
      console.error(error);
      toast.error("Failed to update booking");
    }
  };

  const handleBack = () => navigate("/transportBookings");

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-lg text-slate-600">Loading booking...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 p-6">

      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={handleBack}
          className="p-2 hover:bg-slate-200 rounded-lg"
        >
          <ArrowLeft className="w-6 h-6 text-slate-800" />
        </button>

        <h1 className="text-2xl font-bold text-slate-900">
          Edit Transport Booking
        </h1>
      </div>

      {/* Card */}
      <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-2xl p-8">

        <form onSubmit={handleUpdate} className="space-y-6">

          {/* Customer */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Customer
            </label>
            <input
              type="text"
              value={booking.customerName}
              disabled
              className="w-full border border-slate-200 rounded-lg px-4 py-3 bg-slate-100"
            />
          </div>

          {/* Vehicle */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Vehicle
            </label>
            <input
              type="text"
              value={booking.vehicleType}
              disabled
              className="w-full border border-slate-200 rounded-lg px-4 py-3 bg-slate-100"
            />
          </div>

          {/* Price */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Price Per Day
            </label>
            <input
              type="text"
              value={booking.pricePerDay}
              disabled
              className="w-full border border-slate-200 rounded-lg px-4 py-3 bg-slate-100"
            />
          </div>

          {/* From Location */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              From Location
            </label>
            <input
              type="text"
              name="fromLocation"
              value={booking.fromLocation}
              onChange={handleChange}
              required
              className="w-full border border-slate-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* To Location */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              To Location
            </label>
            <input
              type="text"
              name="toLocation"
              value={booking.toLocation}
              onChange={handleChange}
              required
              className="w-full border border-slate-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Booking Date */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Booking Date
            </label>
            <input
              type="text"
              value={booking.bookingDate}
              disabled
              className="w-full border border-slate-200 rounded-lg px-4 py-3 bg-slate-100"
            />
          </div>

          {/* Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl flex items-center gap-2"
            >
              <Save size={18} />
              Update Booking
            </button>
          </div>

        </form>

      </div>

    </div>
  );
}