import React, { useState, useEffect } from "react";
import {
  ArrowLeft,
  Plus,
  Edit2,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Eye
} from "lucide-react";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function AllTransport() {

  const [transportList, setTransportList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);

  const navigate = useNavigate();

  const API_URL = import.meta.env.VITE_BACKEND_URL_TRANSPORT;

  const carouselImages = [
    "/trans_img1.webp",
    "/trans_img2.webp",
    "/trans_img3.webp"
  ];

  useEffect(() => {
    fetchTransport();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselImages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const fetchTransport = async () => {
    try {

      setLoading(true);

      const response = await axios.get(API_URL);

      setTransportList(response.data);

    } catch (error) {

      console.error("Fetch transport error:", error);

      if (error.response?.status === 403) {
        toast.error("Unauthorized. Please login again.");
        navigate("/");
      } else {
        toast.error("Failed to fetch transport");
      }

      setTransportList([]);

    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {

    if (!window.confirm("Are you sure you want to delete this transport?")) return;

    try {

      await axios.delete(`${API_URL}/${id}`);

      toast.success("Transport deleted successfully");

      fetchTransport();

    } catch (error) {

      console.error("Delete transport error:", error);
      toast.error("Failed to delete transport");

    }
  };

  const handleEdit = (id) => navigate(`/edittransport/${id}`);
  const handleAddTransport = () => navigate("/addtransport");
  const handleAddBooking = () => navigate("/bookTransport");
  const handleViewBookings = () => navigate("/transportBookings");
  const handleBack = () => navigate("/dashboard");

  const nextSlide = () =>
    setCurrentSlide((prev) => (prev + 1) % carouselImages.length);

  const prevSlide = () =>
    setCurrentSlide((prev) => (prev - 1 + carouselImages.length) % carouselImages.length);

  const goToSlide = (index) => setCurrentSlide(index);

  return (

    <div className="min-h-screen bg-slate-100 p-4 md:p-8">

      {/* Header */}
      <div className="flex items-center gap-4 mb-6">

        <button
          onClick={handleBack}
          className="p-2 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-6 h-6 text-slate-900" />
        </button>

        <h1 className="text-2xl md:text-3xl font-bold text-slate-900">
          Transport Management
        </h1>

      </div>

      {/* Main Card */}
      <div className="relative bg-white rounded-2xl shadow-lg overflow-hidden max-w-7xl mx-auto">

        {/* View Bookings Button (Top Right) */}
        <button
          onClick={handleViewBookings}
          className="absolute top-6 right-6 flex text-sm items-center gap-2 bg-green-400 hover:bg-green-500 text-white py-2 px-5 rounded-xl font-semibold shadow-md transition cursor-pointer"
        >
          <Eye size={18} />
          View Bookings
        </button>

        <div className="grid md:grid-cols-2 gap-0">

          {/* Carousel */}
          <div className="relative bg-slate-200 h-80 md:h-auto">

            <div className="relative w-full h-full overflow-hidden">

              {carouselImages.map((image, index) => (

                <div
                  key={index}
                  className={`absolute inset-0 transition-opacity duration-500 ${
                    index === currentSlide ? "opacity-100" : "opacity-0"
                  }`}
                >

                  <img
                    src={image}
                    alt={`Transport ${index + 1}`}
                    className="w-full h-full object-cover"
                  />

                </div>
              ))}

              <button
                onClick={prevSlide}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full"
              >
                <ChevronLeft className="w-6 h-6 text-slate-800" />
              </button>

              <button
                onClick={nextSlide}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full"
              >
                <ChevronRight className="w-6 h-6 text-slate-800" />
              </button>

              {/* Indicators */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">

                {carouselImages.map((_, index) => (

                  <button
                    key={index}
                    onClick={() => goToSlide(index)}
                    className={`w-2 h-2 rounded-full transition-all ${
                      index === currentSlide
                        ? "bg-blue-500 w-6"
                        : "bg-white/60"
                    }`}
                  />

                ))}

              </div>

            </div>

          </div>

          {/* Right Section */}
          <div className="p-8 md:p-12 flex flex-col justify-center">

            <h2 className="text-3xl font-bold text-slate-900 mb-4">
              Manage Transport
            </h2>

            <p className="text-slate-700 mb-6">
              Add, edit, and manage transport vehicles for your hotel.
            </p>

            <button
              onClick={handleAddTransport}
              className="bg-green-400 hover:bg-green-500 text-white py-3 px-8 rounded-2xl font-semibold text-md transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center gap-2 w-full md:w-auto cursor-pointer"
            >
              <Plus className="w-6 h-6" />
              Add Vehicle
            </button>

             <button
              onClick={handleAddBooking}
              className="bg-green-400 mt-5 hover:bg-green-500 text-white py-3 px-8 rounded-2xl font-semibold text-md transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center gap-2 w-full md:w-auto cursor-pointer"
            >
              <Plus className="w-6 h-6" />
              Add Booking
            </button>

          </div>

        </div>

        {/* Transport Table */}
        <div className="p-6 md:p-8">

          <div className="overflow-x-auto">

            <table className="w-full">

              <thead>

                <tr className="border-b-2 border-slate-200">

                  <th className="text-left py-4 px-4">Vehicle Type</th>
                  <th className="text-left py-4 px-4">Vehicle Number</th>
                  <th className="text-left py-4 px-4">Driver Name</th>
                  <th className="text-left py-4 px-4">Driver Contact</th>
                  <th className="text-left py-4 px-4">Price Per Day</th>
                  <th className="text-left py-4 px-4">Status</th>
                  <th className="text-right py-4 px-4">Action</th>

                </tr>

              </thead>

              <tbody>

                {loading ? (

                  <tr>

                    <td colSpan="7" className="text-center py-12">

                      <div className="flex justify-center">

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
                          />

                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8"
                          />

                        </svg>

                      </div>

                    </td>

                  </tr>

                ) : transportList.length === 0 ? (

                  <tr>

                    <td colSpan="7" className="text-center py-12 text-slate-500">
                      No transport vehicles found.
                    </td>

                  </tr>

                ) : (

                  transportList.map((transport) => (

                    <tr
                      key={transport.id}
                      className="border-b border-slate-100 hover:bg-slate-50"
                    >

                      <td className="py-4 px-4">{transport.vehicleType}</td>
                      <td className="py-4 px-4">{transport.vehicleNumber}</td>
                      <td className="py-4 px-4">{transport.driverName}</td>
                      <td className="py-4 px-4">{transport.driverContact}</td>
                      <td className="py-4 px-4">{transport.pricePerDay}</td>
                      <td className="py-4 px-4">{transport.status}</td>

                      <td className="py-4 px-4">

                        <div className="flex justify-end gap-2">

                          <button
                            onClick={() => handleEdit(transport.id)}
                            className="p-2 hover:bg-blue-50 rounded-lg"
                          >
                            <Edit2 className="w-5 h-5 text-slate-600" />
                          </button>

                          <button
                            onClick={() => handleDelete(transport.id)}
                            className="p-2 hover:bg-red-50 rounded-lg"
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