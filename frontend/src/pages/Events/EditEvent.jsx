import React, { useState, useEffect } from 'react';
import { Building2, Clock, Save, X, ArrowLeft, User, CalendarDays, Users, CreditCard, Hash } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

export default function EditEvent() {
    const [formData, setFormData] = useState({
        customerName: '',
        customerId: '',
        bookingDate: '',
        eventTime: '',
        peopleCount: '',
        hallSelection: '',
        paymentStatus: '',
        eventStatus: '',
    });

    const navigate = useNavigate();
    const { id } = useParams();
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [fetchingData, setFetchingData] = useState(true);

    const API_URL = import.meta.env.VITE_BACKEND_URL;

    const hallOptions = ['Hall A', 'Hall B', 'Hall C', 'Banquet Hall', 'Conference Room'];

    useEffect(() => {
        fetchEventData();
    }, [id]);

    const fetchEventData = async () => {
        try {
            setFetchingData(true);
            // Matches Spring Boot @GetMapping("/{id}")
            const response = await axios.get(`${API_URL}/api/events/${id}`);

            setFormData({
                customerName: response.data.customerName,
                customerId: response.data.customerId,
                bookingDate: response.data.bookingDate,
                eventTime: response.data.eventTime,
                peopleCount: response.data.peopleCount.toString(),
                hallSelection: response.data.hallSelection,
                paymentStatus: response.data.paymentStatus,
                eventStatus: response.data.eventStatus,
            });
        } catch (error) {
            console.error('Fetch error:', error);
            toast.error('Failed to fetch event data');
            navigate('/allevents');
        } finally {
            setFetchingData(false);
        }
    };

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
        if (!formData.eventStatus) newErrors.eventStatus = 'Event status is required';
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
            const eventData = {
                ...formData,
                peopleCount: parseInt(formData.peopleCount),
            };

            // Matches Spring Boot @PutMapping("/update/{id}")
            const response = await axios.put(`${API_URL}/api/events/update/${id}`, eventData);

            if (response.status === 200) {
                toast.success('Event updated successfully!');
                navigate('/allevents');
            }
        } catch (error) {
            console.error('Update error:', error);
            if (error.response?.status === 409) {
                toast.error(error.response.data); // Hall conflict message from backend
            } else {
                toast.error('Failed to update event. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    if (fetchingData) {
        return (
            <div className="min-h-screen bg-slate-100 flex items-center justify-center">
                <div className="text-center">
                    <svg className="animate-spin h-12 w-12 text-blue-600 mx-auto mb-4" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <p className="text-slate-600 text-lg">Loading event data...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-100 p-4 md:p-8">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                    <button onClick={() => navigate('/allevents')} className="p-2 hover:bg-slate-200 rounded-lg transition-colors">
                        <ArrowLeft className="w-6 h-6 text-slate-700" />
                    </button>
                    <h1 className="text-2xl md:text-3xl font-bold text-slate-800">Edit Event</h1>
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 max-w-4xl mx-auto">
                <div className="space-y-6">

                    {/* Customer Name & Customer ID */}
                    <div className="grid md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Customer Name</label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                <input
                                    type="text"
                                    name="customerName"
                                    value={formData.customerName}
                                    onChange={handleChange}
                                    disabled={loading}
                                    className={`w-full pl-11 pr-4 py-3 border-2 ${errors.customerName ? 'border-red-300' : 'border-slate-300'} rounded-lg focus:outline-none focus:border-blue-500`}
                                />
                            </div>
                            {errors.customerName && <p className="mt-1 text-sm text-red-600">{errors.customerName}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Customer ID</label>
                            <div className="relative">
                                <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                <input
                                    type="text"
                                    name="customerId"
                                    value={formData.customerId}
                                    onChange={handleChange}
                                    disabled={loading}
                                    className={`w-full pl-11 pr-4 py-3 border-2 ${errors.customerId ? 'border-red-300' : 'border-slate-300'} rounded-lg focus:outline-none focus:border-blue-500`}
                                />
                            </div>
                            {errors.customerId && <p className="mt-1 text-sm text-red-600">{errors.customerId}</p>}
                        </div>
                    </div>

                    {/* Hall Selection */}
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">Hall Selection</label>
                        <div className="relative">
                            <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                            <select
                                name="hallSelection"
                                value={formData.hallSelection}
                                onChange={handleChange}
                                disabled={loading}
                                className={`w-full pl-11 pr-4 py-3 border-2 ${errors.hallSelection ? 'border-red-300' : 'border-slate-300'} rounded-lg focus:outline-none focus:border-blue-500 bg-white`}
                            >
                                <option value="">Select Hall</option>
                                {hallOptions.map(hall => (
                                    <option key={hall} value={hall}>{hall}</option>
                                ))}
                            </select>
                        </div>
                        {errors.hallSelection && <p className="mt-1 text-sm text-red-600">{errors.hallSelection}</p>}
                    </div>

                    {/* Booking Date & Event Time */}
                    <div className="grid md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Booking Date</label>
                            <div className="relative">
                                <CalendarDays className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                <input
                                    type="date"
                                    name="bookingDate"
                                    value={formData.bookingDate}
                                    onChange={handleChange}
                                    disabled={loading}
                                    className={`w-full pl-11 pr-4 py-3 border-2 ${errors.bookingDate ? 'border-red-300' : 'border-slate-300'} rounded-lg focus:outline-none focus:border-blue-500`}
                                />
                            </div>
                            {errors.bookingDate && <p className="mt-1 text-sm text-red-600">{errors.bookingDate}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Event Time</label>
                            <div className="relative">
                                <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                <input
                                    type="time"
                                    name="eventTime"
                                    value={formData.eventTime}
                                    onChange={handleChange}
                                    disabled={loading}
                                    className={`w-full pl-11 pr-4 py-3 border-2 ${errors.eventTime ? 'border-red-300' : 'border-slate-300'} rounded-lg focus:outline-none focus:border-blue-500`}
                                />
                            </div>
                            {errors.eventTime && <p className="mt-1 text-sm text-red-600">{errors.eventTime}</p>}
                        </div>
                    </div>

                    {/* People Count & Payment Status */}
                    <div className="grid md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Number of People</label>
                            <div className="relative">
                                <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                <input
                                    type="number"
                                    name="peopleCount"
                                    value={formData.peopleCount}
                                    onChange={handleChange}
                                    min="1"
                                    disabled={loading}
                                    className={`w-full pl-11 pr-4 py-3 border-2 ${errors.peopleCount ? 'border-red-300' : 'border-slate-300'} rounded-lg focus:outline-none focus:border-blue-500`}
                                />
                            </div>
                            {errors.peopleCount && <p className="mt-1 text-sm text-red-600">{errors.peopleCount}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Payment Status</label>
                            <div className="relative">
                                <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                <select
                                    name="paymentStatus"
                                    value={formData.paymentStatus}
                                    onChange={handleChange}
                                    disabled={loading}
                                    className={`w-full pl-11 pr-4 py-3 border-2 ${errors.paymentStatus ? 'border-red-300' : 'border-slate-300'} rounded-lg focus:outline-none focus:border-blue-500 bg-white`}
                                >
                                    <option value="PENDING">PENDING</option>
                                    <option value="PAID">PAID</option>
                                    <option value="CANCELLED">CANCELLED</option>
                                </select>
                            </div>
                            {errors.paymentStatus && <p className="mt-1 text-sm text-red-600">{errors.paymentStatus}</p>}
                        </div>
                    </div>

                    {/* Event Status */}
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">Event Status</label>
                        <div className="relative">
                            <select
                                name="eventStatus"
                                value={formData.eventStatus}
                                onChange={handleChange}
                                disabled={loading}
                                className={`w-full px-4 py-3 border-2 ${errors.eventStatus ? 'border-red-300' : 'border-slate-300'} rounded-lg focus:outline-none focus:border-blue-500 bg-white`}
                            >
                                <option value="CONFIRMED">CONFIRMED</option>
                                <option value="CANCELLED">CANCELLED</option>
                                <option value="COMPLETED">COMPLETED</option>
                            </select>
                        </div>
                        {errors.eventStatus && <p className="mt-1 text-sm text-red-600">{errors.eventStatus}</p>}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 pt-6">
                        <button
                            onClick={handleSubmit}
                            disabled={loading}
                            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold shadow-md hover:shadow-lg disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            {loading ? 'Updating...' : <><Save className="w-5 h-5" /> Update Event</>}
                        </button>
                        <button
                            onClick={() => fetchEventData()}
                            disabled={loading}
                            className="flex-1 bg-slate-200 hover:bg-slate-300 text-slate-700 py-3 rounded-lg font-semibold disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            <X className="w-5 h-5" /> Reset Form
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
}
