import React, { useState } from 'react';
import { Home, DollarSign, Save, X, ArrowLeft, User, CalendarDays } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function AddReservation() {
    const [formData, setFormData] = useState({
        customerName: '',
        roomType: '',
        checkInDate: '',
        checkOutDate: '',
        totalPrice: ''
    });
    
    const navigate = useNavigate();
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    
    const API_URL = import.meta.env.VITE_BACKEND_URL2;
    
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

    const validateForm = () => {
        const newErrors = {};

        if (!formData.customerName.trim()) {
            newErrors.customerName = 'Customer name is required';
        }

        if (!formData.roomType.trim()) {
            newErrors.roomType = 'Room type is required';
        }

        if (!formData.checkInDate) {
            newErrors.checkInDate = 'Check-in date is required';
        }

        if (!formData.checkOutDate) {
            newErrors.checkOutDate = 'Check-out date is required';
        } else if (formData.checkInDate && formData.checkOutDate < formData.checkInDate) {
            newErrors.checkOutDate = 'Check-out cannot be before check-in';
        }

        if (!formData.totalPrice) {
            newErrors.totalPrice = 'Total price is required';
        } else if (isNaN(formData.totalPrice) || parseFloat(formData.totalPrice) <= 0) {
            newErrors.totalPrice = 'Price must be a positive number';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            toast.error('Please fix all errors before submitting');
            return;
        }

        setLoading(true);

        try {
            const reservationData = {
                customerName: formData.customerName,
                roomType: formData.roomType,
                checkInDate: formData.checkInDate,
                checkOutDate: formData.checkOutDate,
                totalPrice: parseFloat(formData.totalPrice)
            };

            // Matches your Spring Boot @PostMapping
            const response = await axios.post(`${API_URL}/reservations`, reservationData);

            if (response.status === 201 || response.status === 200) {
                toast.success('Reservation added successfully!');
                handleReset();
                navigate('/allreservations');
            }
        } catch (error) {
            console.error('Add reservation error:', error);
            if (error.response) {
                const errorMsg = error.response.data.message || 'Failed to add reservation.';
                toast.error(errorMsg);
            } else if (error.request) {
                toast.error('Unable to connect to server.');
            } 
        } finally {
            setLoading(false);
        }
    };

    const handleReset = () => {
        setFormData({
            customerName: '',
            roomType: '',
            checkInDate: '',
            checkOutDate: '',
            totalPrice: ''
        });
        setErrors({});
        toast.info('Form reset');
    };

    const handleBack = () => {
        const hasData = Object.values(formData).some(value => value !== '');
        
        if (hasData && !window.confirm('Are you sure you want to go back? Unsaved changes will be lost.')) {
            return;
        }
        
        navigate('/allreservations');
    };

    return (
        <div className="min-h-screen bg-slate-100 p-4 md:p-8">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                    <button 
                        onClick={handleBack}
                        className="p-2 hover:bg-slate-200 rounded-lg transition-colors"
                    >
                        <ArrowLeft className="w-6 h-6 text-slate-700" />
                    </button>
                    <h1 className="text-2xl md:text-3xl font-bold text-slate-800">
                        Add New Reservation
                    </h1>
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 max-w-4xl mx-auto">
                <div className="space-y-6">
                    {/* Customer Name */}
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                            Customer Name <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                            <input
                                type="text"
                                name="customerName"
                                value={formData.customerName}
                                onChange={handleChange}
                                className={`w-full pl-11 pr-4 py-3 border-2 ${errors.customerName ? 'border-red-300' : 'border-slate-300'} rounded-lg focus:outline-none focus:border-blue-500 transition-colors text-slate-800 placeholder-slate-400`}
                                placeholder="Enter customer full name"
                                disabled={loading}
                            />
                        </div>
                        {errors.customerName && <p className="mt-1 text-sm text-red-600">{errors.customerName}</p>}
                    </div>

                    {/* Room Type */}
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                            Room Type <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                            <Home className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                            <select
                                name="roomType"
                                value={formData.roomType}
                                onChange={handleChange}
                                className={`w-full pl-11 pr-4 py-3 border-2 ${errors.roomType ? 'border-red-300' : 'border-slate-300'} rounded-lg focus:outline-none focus:border-blue-500 transition-colors text-slate-800 bg-white`}
                                disabled={loading}
                            >
                                <option value="">Select room type</option>
                                <option value="Single">Single</option>
                                <option value="Double">Double</option>
                                <option value="Family">Family</option>
                                <option value="Deluxe">Deluxe</option>
                            </select>
                        </div>
                        {errors.roomType && <p className="mt-1 text-sm text-red-600">{errors.roomType}</p>}
                    </div>

                    {/* Check In and Check Out Dates (Side by Side) */}
                    <div className="grid md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                                Check-in Date <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <CalendarDays className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                                <input
                                    type="date"
                                    name="checkInDate"
                                    value={formData.checkInDate}
                                    onChange={handleChange}
                                    className={`w-full pl-11 pr-4 py-3 border-2 ${errors.checkInDate ? 'border-red-300' : 'border-slate-300'} rounded-lg focus:outline-none focus:border-blue-500 transition-colors text-slate-800`}
                                    disabled={loading}
                                />
                            </div>
                            {errors.checkInDate && <p className="mt-1 text-sm text-red-600">{errors.checkInDate}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                                Check-out Date <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <CalendarDays className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                                <input
                                    type="date"
                                    name="checkOutDate"
                                    value={formData.checkOutDate}
                                    onChange={handleChange}
                                    className={`w-full pl-11 pr-4 py-3 border-2 ${errors.checkOutDate ? 'border-red-300' : 'border-slate-300'} rounded-lg focus:outline-none focus:border-blue-500 transition-colors text-slate-800`}
                                    disabled={loading}
                                />
                            </div>
                            {errors.checkOutDate && <p className="mt-1 text-sm text-red-600">{errors.checkOutDate}</p>}
                        </div>
                    </div>

                    {/* Price */}
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                            Total Price (LKR) <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                            <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                            <input
                                type="number"
                                name="totalPrice"
                                value={formData.totalPrice}
                                onChange={handleChange}
                                step="0.01"
                                min="0"
                                className={`w-full pl-11 pr-4 py-3 border-2 ${errors.totalPrice ? 'border-red-300' : 'border-slate-300'} rounded-lg focus:outline-none focus:border-blue-500 transition-colors text-slate-800 placeholder-slate-400`}
                                placeholder="Enter total price"
                                disabled={loading}
                            />
                        </div>
                        {errors.totalPrice && <p className="mt-1 text-sm text-red-600">{errors.totalPrice}</p>}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 pt-6">
                        <button
                            onClick={handleSubmit}
                            disabled={loading}
                            className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-3 rounded-lg font-semibold transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            {loading ? 'Saving...' : <><Save className="w-5 h-5" /> Save Reservation</>}
                        </button>
                        <button
                            onClick={handleReset}
                            disabled={loading}
                            className="flex-1 bg-slate-200 hover:bg-slate-300 text-slate-700 py-3 rounded-lg font-semibold transition-all flex items-center justify-center gap-2"
                        >
                            <X className="w-5 h-5" /> Reset Form
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}