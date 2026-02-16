import React, { useState, useEffect } from "react";
import {
  Hash,
  User,
  Calendar,
  MessageSquare,
  Save,
  X,
  ArrowLeft,
} from "lucide-react";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function AddHouseKeeping() {
  const [formData, setFormData] = useState({
    roomNumber: "",
    staffId: "",
    cleaningDate: "",
    status: "PENDING",
    remarks: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [rooms, setRooms] = useState([]);

  const navigate = useNavigate();

  const API_URL = import.meta.env.VITE_BACKEND_URL_HOUSEKEPING;
  const ROOMS_API_URL = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      const response = await axios.get(`${ROOMS_API_URL}/rooms/all`);
      setRooms(response.data);
    } catch (error) {
      console.error("Fetch rooms error:", error);
      toast.error("Failed to load rooms");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.roomNumber.trim()) {
      newErrors.roomNumber = "Room number is required";
    }

    if (!formData.staffId.trim()) {
      newErrors.staffId = "Staff ID is required";
    }

    if (!formData.cleaningDate) {
      newErrors.cleaningDate = "Cleaning date is required";
    }

    if (!formData.status) {
      newErrors.status = "Status is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fix all errors before submitting");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(`${API_URL}/housekeeping`, formData);

      if (response.status === 200 || response.status === 201) {
        toast.success("Housekeeping task added successfully!");
        handleReset();
      }
    } catch (error) {
      console.error("API Error:", error);

      if (error.response) {
        toast.error(error.response.data?.message || "Server error occurred");
      } else if (error.request) {
        toast.error("Backend not responding");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFormData({
      roomNumber: "",
      staffId: "",
      cleaningDate: "",
      status: "PENDING",
      remarks: "",
    });
    setErrors({});
    toast.info("Form reset");
  };

  const handleBack = () => {
    const hasData = Object.values(formData).some(
      (value) => value !== "" && value !== "PENDING",
    );

    if (
      hasData &&
      !window.confirm(
        "Are you sure you want to go back? Unsaved changes will be lost.",
      )
    ) {
      return;
    }

    navigate("/allCleaners");
  };

  return (
    <div className="min-h-screen bg-slate-100 p-4 md:p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <button
            onClick={handleBack}
            className="p-2 hover:bg-slate-200 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-6 h-6 text-slate-700" />
          </button>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-800">
            Add Housekeeping Task
          </h1>
        </div>
      </div>

      {/* Form Card */}
      <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 max-w-4xl mx-auto">
        <div className="space-y-6">
          {/* Room Number */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Room Number <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <select
                name="roomNumber"
                value={formData.roomNumber}
                onChange={handleChange}
                className={`w-full pl-11 pr-4 py-3 border-2 ${
                  errors.roomNumber ? "border-red-300" : "border-slate-300"
                } rounded-lg focus:outline-none focus:border-blue-500 bg-white`}
                disabled={loading}
              >
                {rooms.map((room) => (
                  <option key={room.id} value={room.roomNumber}>
                    {room.roomNumber}
                  </option>
                ))}
              </select>
            </div>
            {errors.roomNumber && (
              <p className="mt-1 text-sm text-red-600">{errors.roomNumber}</p>
            )}
          </div>

          {/* Staff ID */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Staff ID <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                name="staffId"
                value={formData.staffId}
                onChange={handleChange}
                className={`w-full pl-11 pr-4 py-3 border-2 ${
                  errors.staffId ? "border-red-300" : "border-slate-300"
                } rounded-lg focus:outline-none focus:border-blue-500`}
                placeholder="STF001"
                disabled={loading}
              />
            </div>
            {errors.staffId && (
              <p className="mt-1 text-sm text-red-600">{errors.staffId}</p>
            )}
          </div>

          {/* Cleaning Date */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Cleaning Date <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="date"
                name="cleaningDate"
                value={formData.cleaningDate}
                onChange={handleChange}
                className={`w-full pl-11 pr-4 py-3 border-2 ${
                  errors.cleaningDate ? "border-red-300" : "border-slate-300"
                } rounded-lg focus:outline-none focus:border-blue-500`}
                disabled={loading}
              />
            </div>
            {errors.cleaningDate && (
              <p className="mt-1 text-sm text-red-600">{errors.cleaningDate}</p>
            )}
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Status <span className="text-red-500">*</span>
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className={`w-full px-4 py-3 border-2 ${
                errors.status ? "border-red-300" : "border-slate-300"
              } rounded-lg focus:outline-none focus:border-blue-500 bg-white`}
              disabled={loading}
            >
              <option value="PENDING">Pending</option>
              <option value="COMPLETED">Completed</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          </div>

          {/* Remarks */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Remarks
            </label>
            <div className="relative">
              <MessageSquare className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
              <textarea
                name="remarks"
                value={formData.remarks}
                onChange={handleChange}
                className="w-full pl-11 pr-4 py-3 border-2 border-slate-300 rounded-lg focus:outline-none focus:border-blue-500"
                rows="3"
                placeholder="Optional remarks"
                disabled={loading}
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 pt-6">
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="flex-1 bg-linear-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-3 rounded-lg font-semibold flex items-center justify-center gap-2"
            >
              <Save className="w-5 h-5" />
              Save
            </button>

            <button
              onClick={handleReset}
              disabled={loading}
              className="flex-1 bg-slate-200 hover:bg-slate-300 text-slate-700 py-3 rounded-lg font-semibold flex items-center justify-center gap-2"
            >
              <X className="w-5 h-5" />
              Reset Form
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddHouseKeeping;
