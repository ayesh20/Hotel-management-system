import React, { useState } from 'react';
import {
    Truck,
    Hash,
    User,
    Phone,
    DollarSign,
    Activity,
    Save,
    X,
    ArrowLeft
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function AddTransport() {

    const navigate = useNavigate();
    const API_URL = import.meta.env.VITE_BACKEND_URL_TRANSPORT;

    const [formData, setFormData] = useState({
        vehicleType: '',
        vehicleNumber: '',
        driverName: '',
        driverContact: '',
        pricePerDay: '',
        status: 'AVAILABLE',
    });

    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    // Handle Change
    const handleChange = (e) => {

        const { name, value } = e.target;

        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    // Validate Form
    const validateForm = () => {

        const newErrors = {};

        if (!formData.vehicleType.trim()) {
            newErrors.vehicleType = 'Vehicle type is required';
        }

        if (!formData.vehicleNumber.trim()) {
            newErrors.vehicleNumber = 'Vehicle number is required';
        }

        if (!formData.driverName.trim()) {
            newErrors.driverName = 'Driver name is required';
        }

        if (!formData.driverContact.trim()) {
            newErrors.driverContact = 'Driver contact is required';
        }

        if (!formData.pricePerDay.toString().trim()) {
            newErrors.pricePerDay = 'Price per day is required';
        }

        if (!formData.status.trim()) {
            newErrors.status = 'Status is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Submit
    const handleSubmit = async (e) => {

        e.preventDefault();

        if (!validateForm()) {
            toast.error('Please fix all errors before submitting');
            return;
        }

        setLoading(true);

        try {

            const token = localStorage.getItem("token");

            const response = await axios.post(
                `${API_URL}/add`,
                {
                    ...formData,
                    pricePerDay: Number(formData.pricePerDay)
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            if (response.status === 200 || response.status === 201) {
                toast.success("Transport added successfully!");
                navigate("/alltransport");
            }

        } catch (error) {

            console.error("Add transport error:", error);

            if (error.response) {
                toast.error(
                    error.response.data.message ||
                    "Failed to add transport"
                );
            } else {
                toast.error("Server connection failed");
            }

        } finally {
            setLoading(false);
        }
    };

    // Reset
    const handleReset = () => {

        setFormData({
            vehicleType: '',
            vehicleNumber: '',
            driverName: '',
            driverContact: '',
            pricePerDay: '',
            status: 'AVAILABLE',
        });

        setErrors({});
    };

    // Back
    const handleBack = () => {

        const hasData = Object.values(formData)
            .some(value => value !== '' && value !== 'AVAILABLE');

        if (hasData && !window.confirm("Unsaved changes will be lost. Continue?")) {
            return;
        }

        navigate('/alltransport');
    };

    return (
        <div className="min-h-screen bg-slate-100 p-4 md:p-8">

            {/* Header */}
            <div className="flex items-center gap-2 mb-6">

                <button
                    onClick={handleBack}
                    className="p-2 hover:bg-slate-200 rounded-lg cursor-pointer"
                >
                    <ArrowLeft className="w-6 h-6" />
                </button>

                <h1 className="text-2xl font-bold">
                    Add New Transport
                </h1>

            </div>

            {/* Form */}
            <div className="bg-white rounded-2xl shadow-lg p-8 max-w-4xl mx-auto">

                <div className="space-y-6">

                    {/* Vehicle Type */}
                    <div>
                        <label className="block font-semibold mb-2">
                            Vehicle Type *
                        </label>

                        <div className="relative">
                            <Truck className="absolute left-3 top-4 w-5 h-5 text-slate-400" />
                            <input
                                type="text"
                                name="vehicleType"
                                value={formData.vehicleType}
                                onChange={handleChange}
                                className="w-full pl-10 py-3 border-2 border-gray-300 rounded-lg"
                                placeholder="Van, Car, Bus..."
                            />
                        </div>

                        {errors.vehicleType &&
                            <p className="text-red-500 text-sm">{errors.vehicleType}</p>}
                    </div>

                    {/* Vehicle Number */}
                    <div>
                        <label className="block font-semibold mb-2">
                            Vehicle Number *
                        </label>

                        <div className="relative">
                            <Hash className="absolute left-3 top-4 w-5 h-5 text-slate-400" />
                            <input
                                type="text"
                                name="vehicleNumber"
                                value={formData.vehicleNumber}
                                onChange={handleChange}
                                className="w-full pl-10 py-3 border-2 border-gray-300 rounded-lg"
                                placeholder="VD-2345"
                            />
                        </div>

                        {errors.vehicleNumber &&
                            <p className="text-red-500 text-sm">{errors.vehicleNumber}</p>}
                    </div>

                    {/* Driver Name */}
                    <div>
                        <label className="block font-semibold mb-2">
                            Driver Name *
                        </label>

                        <div className="relative">
                            <User className="absolute left-3 top-4 w-5 h-5 text-slate-400" />
                            <input
                                type="text"
                                name="driverName"
                                value={formData.driverName}
                                onChange={handleChange}
                                className="w-full pl-10 py-3 border-2 border-gray-300 rounded-lg"
                                placeholder="Enter driver name"
                            />
                        </div>

                        {errors.driverName &&
                            <p className="text-red-500 text-sm">{errors.driverName}</p>}
                    </div>

                    {/* Driver Contact */}
                    <div>
                        <label className="block font-semibold mb-2">
                            Driver Contact *
                        </label>

                        <div className="relative">
                            <Phone className="absolute left-3 top-4 w-5 h-5 text-slate-400" />
                            <input
                                type="text"
                                name="driverContact"
                                value={formData.driverContact}
                                onChange={handleChange}
                                className="w-full pl-10 py-3 border-2 border-gray-300 rounded-lg"
                                placeholder="0765665456"
                            />
                        </div>

                        {errors.driverContact &&
                            <p className="text-red-500 text-sm">{errors.driverContact}</p>}
                    </div>

                    {/* Price Per Day */}
                    <div>
                        <label className="block font-semibold mb-2">
                            Price Per Day *
                        </label>

                        <div className="relative">
                            <DollarSign className="absolute left-3 top-4 w-5 h-5 text-slate-400" />
                            <input
                                type="number"
                                name="pricePerDay"
                                value={formData.pricePerDay}
                                onChange={handleChange}
                                className="w-full pl-10 py-3 border-2 border-gray-300 rounded-lg"
                                placeholder="20000"
                            />
                        </div>

                        {errors.pricePerDay &&
                            <p className="text-red-500 text-sm">{errors.pricePerDay}</p>}
                    </div>

                    {/* Status */}
                    <div>
                        <label className="block font-semibold mb-2">
                            Status *
                        </label>

                        <div className="relative">
                            <Activity className="absolute left-3 top-4 w-5 h-5 text-slate-400" />
                            <select
                                name="status"
                                value={formData.status}
                                onChange={handleChange}
                                className="w-full pl-10 py-3 border-2 border-gray-300 rounded-lg"
                            >
                                <option value="AVAILABLE">AVAILABLE</option>
                                <option value="UNAVAILABLE">UNAVAILABLE</option>
                                <option value="MAINTENANCE">MAINTENANCE</option>
                            </select>
                        </div>

                        {errors.status &&
                            <p className="text-red-500 text-sm">{errors.status}</p>}
                    </div>

                    {/* Buttons */}
                    <div className="flex gap-4 pt-4">

                        <button
                            onClick={handleSubmit}
                            disabled={loading}
                            className="flex-1 bg-blue-600 text-white py-3 rounded-lg flex items-center justify-center gap-2 cursor-pointer"
                        >
                            <Save size={18} />
                            {loading ? "Saving..." : "Save Transport"}
                        </button>

                        <button
                            onClick={handleReset}
                            className="flex-1 bg-slate-200 py-3 rounded-lg flex items-center justify-center gap-2 cursor-pointer"
                        >
                            <X size={18} />
                            Reset
                        </button>

                    </div>

                </div>

            </div>

        </div>
    );
}