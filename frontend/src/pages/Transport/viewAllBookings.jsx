import React, { useEffect, useState } from "react";
import axios from "axios";
import { Pencil, Trash2, Plus, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const BOOKING_URL = import.meta.env.VITE_BACKEND_URL_TRANSPORT_BOOKING;

export default function ViewAllBookings() {

  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const res = await axios.get(BOOKING_URL);
      setBookings(res.data);
    } catch (error) {
      console.error("Error fetching bookings:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this booking?")) return;

    try {
      await axios.delete(`${BOOKING_URL}/${id}`);
      toast.success("Booking deleted successfully");
      fetchBookings();
    } catch (error) {
      console.error("Error deleting booking:", error);
    }
  };

  const handleBack = () => navigate("/allTransport");

  return (
    <div className="min-h-screen bg-slate-100 p-4 md:p-8">

      {/* Header */}
      <div className="flex items-center justify-between mb-6">

        <div className="flex items-center gap-4">
          <button
            onClick={handleBack}
            className="p-2 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-6 h-6 text-slate-900" />
          </button>

          <h1 className="text-2xl md:text-3xl font-bold text-slate-900">
            View Bookings
          </h1>
        </div>

      </div>

      {/* Card */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden max-w-7xl mx-auto">

        <div className="p-6 md:p-8">

          <div className="overflow-x-auto">

            <table className="w-full">

              {/* Table Header */}
              <thead>
                <tr className="border-b-2 border-slate-200">
                  <th className="text-left py-4 px-4 text-slate-700 font-semibold">Customer</th>
                  <th className="text-left py-4 px-4 text-slate-700 font-semibold">Vehicle</th>
                  <th className="text-left py-4 px-4 text-slate-700 font-semibold">Price / Day</th>
                  <th className="text-left py-4 px-4 text-slate-700 font-semibold">From</th>
                  <th className="text-left py-4 px-4 text-slate-700 font-semibold">To</th>
                  <th className="text-left py-4 px-4 text-slate-700 font-semibold">Status</th>
                  <th className="text-left py-4 px-4 text-slate-700 font-semibold">Booking Date</th>
                  <th className="text-right py-4 px-4 text-slate-700 font-semibold">Action</th>
                </tr>
              </thead>

              {/* Table Body */}
              <tbody>

                {loading ? (

                  <tr>
                    <td colSpan="8" className="text-center py-12">
                      <div className="flex justify-center items-center">
                        <svg
                          className="animate-spin h-8 w-8 text-blue-600"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 
                            0 0 5.373 0 12h4zm2 
                            5.291A7.962 7.962 
                            0 014 12H0c0 
                            3.042 1.135 
                            5.824 3 
                            7.938l3-2.647z"
                          ></path>
                        </svg>
                      </div>
                    </td>
                  </tr>

                ) : bookings.length === 0 ? (

                  <tr>
                    <td colSpan="8" className="text-center py-12 text-slate-500">
                      No bookings found. Click "Add Booking" to create one.
                    </td>
                  </tr>

                ) : (

                  bookings.map((b) => (
                    <tr
                      key={b.bookingId}
                      className="border-b border-slate-100 hover:bg-slate-50 transition-colors"
                    >

                      <td className="py-4 px-4 text-slate-800">{b.customerName}</td>

                      <td className="py-4 px-4 text-slate-800">{b.vehicleType}</td>

                      <td className="py-4 px-4 text-slate-800">
                        $ {b.pricePerDay}
                      </td>

                      <td className="py-4 px-4 text-slate-800">{b.fromLocation}</td>

                      <td className="py-4 px-4 text-slate-800">{b.toLocation}</td>

                      <td className="py-4 px-4">
                        <span className="px-3 py-1 text-sm rounded-full bg-green-100 text-green-700 font-medium">
                          {b.status}
                        </span>
                      </td>

                      <td className="py-4 px-4 text-slate-800">{b.bookingDate}</td>

                      <td className="py-4 px-4">
                        <div className="flex items-center justify-end gap-2">

                          <button
                            onClick={() => navigate(`/editBooking/${b.bookingId}`)}
                            className="p-2 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                            title="Edit Booking"
                          >
                            <Pencil className="w-5 h-5 text-slate-600" />
                          </button>

                          <button
                            onClick={() => handleDelete(b.bookingId)}
                            className="p-2 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                            title="Delete Booking"
                          >
                            <Trash2 className="w-5 h-5 text-slate-600" />
                          </button>

                        </div>
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
}