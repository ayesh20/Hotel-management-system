import React, { useState } from 'react';
import { Building2, Clock, Save, ArrowLeft, User, CalendarDays, Users, CreditCard, Hash, LayoutDashboard } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';


export default function AddEvent() {
    const [formData, setFormData] = useState({
        customerName: '',
        customerId: '',
        bookingDate: '',
        eventTime: '',
        peopleCount: '',
        hallSelection: '',
        paymentStatus: 'PENDING',
        eventStatus: 'CONFIRMED',
    });

    const navigate = useNavigate();
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    const API_URL = import.meta.env.VITE_BACKEND_URL;

    const hallOptions = ['Hall A', 'Hall B', 'Hall C', 'Banquet Hall', 'Conference Room'];

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.customerName.trim()) newErrors.customerName = 'Customer name is required';
        if (!formData.customerId.trim()) newErrors.customerId = 'Customer ID is required';
        if (!formData.bookingDate) newErrors.bookingDate = 'Booking date is required';
        if (!formData.eventTime) newErrors.eventTime = 'Event time is required';
        if (!formData.peopleCount) {
            newErrors.peopleCount = 'People count is required';
        } else if (parseInt(formData.peopleCount) <= 0) {
            newErrors.peopleCount = 'People count must be a positive number';
        }
        if (!formData.hallSelection) newErrors.hallSelection = 'Hall selection is required';
        if (!formData.paymentStatus) newErrors.paymentStatus = 'Payment status is required';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) {
            toast.error('Please fix errors before submitting');
            return;
        }

        setLoading(true);
        try {
            const eventData = {
                ...formData,
                peopleCount: parseInt(formData.peopleCount),
            };

            await axios.post(`${API_URL}/api/events/add`, eventData);
            toast.success('Event created successfully!');
            navigate('/allevents');
        } catch (error) {
            if (error.response?.status === 409) {
                toast.error(error.response.data);
            } else {
                toast.error('Failed to create event');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-100 p-4 md:p-8">
            {/*  Only change is here - header now has Dashboard button */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                    <button onClick={() => navigate('/allevents')} className="p-2 hover:bg-slate-200 rounded-lg">
                        <ArrowLeft className="w-6 h-6 text-slate-700" />
                    </button>
                    <h1 className="text-2xl font-bold text-slate-800">New Event</h1>
                </div>
                <button
                    onClick={() => navigate('/eventdashboard')}
                    className="flex items-center gap-2 px-4 py-2 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg text-slate-700 font-medium shadow-sm transition-colors"
                >
                    <LayoutDashboard className="w-4 h-4" />
                    Dashboard
                </button>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 max-w-4xl mx-auto">
                <div className="space-y-6">

                    {/* Customer Name & Customer ID */}
                    <div className="grid md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Customer Name *</label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                <input
                                    type="text"
                                    name="customerName"
                                    value={formData.customerName}
                                    onChange={handleChange}
                                    className={`w-full pl-11 pr-4 py-3 border-2 ${errors.customerName ? 'border-red-300' : 'border-slate-300'} rounded-lg focus:outline-none focus:border-blue-500`}
                                    placeholder="Enter customer name"
                                />
                            </div>
                            {errors.customerName && <p className="text-red-500 text-sm mt-1">{errors.customerName}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Customer ID *</label>
                            <div className="relative">
                                <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                <input
                                    type="text"
                                    name="customerId"
                                    value={formData.customerId}
                                    onChange={handleChange}
                                    className={`w-full pl-11 pr-4 py-3 border-2 ${errors.customerId ? 'border-red-300' : 'border-slate-300'} rounded-lg focus:outline-none focus:border-blue-500`}
                                    placeholder="Enter customer ID"
                                />
                            </div>
                            {errors.customerId && <p className="text-red-500 text-sm mt-1">{errors.customerId}</p>}
                        </div>
                    </div>

                    {/* Hall Selection */}
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">Hall Selection *</label>
                        <div className="relative">
                            <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                            <select
                                name="hallSelection"
                                value={formData.hallSelection}
                                onChange={handleChange}
                                className={`w-full pl-11 pr-4 py-3 border-2 ${errors.hallSelection ? 'border-red-300' : 'border-slate-300'} rounded-lg focus:outline-none focus:border-blue-500 bg-white`}
                            >
                                <option value="">Select Hall</option>
                                {hallOptions.map(hall => (
                                    <option key={hall} value={hall}>{hall}</option>
                                ))}
                            </select>
                        </div>
                        {errors.hallSelection && <p className="text-red-500 text-sm mt-1">{errors.hallSelection}</p>}
                    </div>

                    {/* Booking Date & Event Time */}
                    <div className="grid md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Booking Date *</label>
                            <div className="relative">
                                <CalendarDays className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                <input
                                    type="date"
                                    name="bookingDate"
                                    value={formData.bookingDate}
                                    onChange={handleChange}
                                    className={`w-full pl-11 pr-4 py-3 border-2 ${errors.bookingDate ? 'border-red-300' : 'border-slate-300'} rounded-lg focus:outline-none focus:border-blue-500`}
                                />
                            </div>
                            {errors.bookingDate && <p className="text-red-500 text-sm mt-1">{errors.bookingDate}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Event Time *</label>
                            <div className="relative">
                                <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                <input
                                    type="time"
                                    name="eventTime"
                                    value={formData.eventTime}
                                    onChange={handleChange}
                                    className={`w-full pl-11 pr-4 py-3 border-2 ${errors.eventTime ? 'border-red-300' : 'border-slate-300'} rounded-lg focus:outline-none focus:border-blue-500`}
                                />
                            </div>
                            {errors.eventTime && <p className="text-red-500 text-sm mt-1">{errors.eventTime}</p>}
                        </div>
                    </div>

                    {/* People Count & Payment Status */}
                    <div className="grid md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Number of People *</label>
                            <div className="relative">
                                <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                <input
                                    type="number"
                                    name="peopleCount"
                                    value={formData.peopleCount}
                                    onChange={handleChange}
                                    min="1"
                                    className={`w-full pl-11 pr-4 py-3 border-2 ${errors.peopleCount ? 'border-red-300' : 'border-slate-300'} rounded-lg focus:outline-none focus:border-blue-500`}
                                    placeholder="Enter number of people"
                                />
                            </div>
                            {errors.peopleCount && <p className="text-red-500 text-sm mt-1">{errors.peopleCount}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Payment Status *</label>
                            <div className="relative">
                                <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                <select
                                    name="paymentStatus"
                                    value={formData.paymentStatus}
                                    onChange={handleChange}
                                    className={`w-full pl-11 pr-4 py-3 border-2 ${errors.paymentStatus ? 'border-red-300' : 'border-slate-300'} rounded-lg focus:outline-none focus:border-blue-500 bg-white`}
                                >
                                    <option value="PENDING">PENDING</option>
                                    <option value="PAID">PAID</option>
                                    <option value="CANCELLED">CANCELLED</option>
                                </select>
                            </div>
                            {errors.paymentStatus && <p className="text-red-500 text-sm mt-1">{errors.paymentStatus}</p>}
                        </div>
                    </div>

                    {/* Submit Button */}
                    <button
                        onClick={handleSubmit}
                        disabled={loading}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-lg font-bold shadow-lg transition-all flex justify-center items-center gap-2 disabled:opacity-50"
                    >
                        {loading ? 'Saving...' : <><Save className="w-5 h-5" /> Confirm Event</>}
                    </button>

                </div>
            </div>
        </div>
    );
}