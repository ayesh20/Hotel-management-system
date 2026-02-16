import React, { useState, useEffect } from 'react';
import { Home, DollarSign, Save, X, ArrowLeft, User, CalendarDays } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

export default function EditReservation() {
    const [formData, setFormData] = useState({
        customerName: '',
        roomType: '',
        checkInDate: '',
        checkOutDate: '',
        totalPrice: ''
    });
    
    const navigate = useNavigate();
    const { id } = useParams(); 
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [fetchingData, setFetchingData] = useState(true);
    
    const API_URL = import.meta.env.VITE_BACKEND_URL;

    useEffect(() => {
        fetchReservationData();
    }, [id]);

    const fetchReservationData = async () => {
        try {
            setFetchingData(true);
            // Matches your Spring Boot @GetMapping("/{id}")
            const response = await axios.get(`${API_URL}/reservations/${id}`);
            
            setFormData({
                customerName: response.data.customerName,
                roomType: response.data.roomType,
                checkInDate: response.data.checkInDate,
                checkOutDate: response.data.checkOutDate,
                totalPrice: response.data.totalPrice.toString()
            });
        } catch (error) {
            console.error('Fetch error:', error);
            toast.error('Failed to fetch reservation data');
            navigate('/allreservations');
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
        if (!formData.roomType.trim()) newErrors.roomType = 'Room type is required';
        if (!formData.checkInDate) newErrors.checkInDate = 'Check-in date is required';
        if (!formData.checkOutDate) {
            newErrors.checkOutDate = 'Check-out date is required';
        } else if (formData.checkInDate && formData.checkOutDate < formData.checkInDate) {
            newErrors.checkOutDate = 'Check-out cannot be before check-in';
        }
        if (!formData.totalPrice) {
            newErrors.totalPrice = 'Price is required';
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

            // Matches your Spring Boot @PutMapping("/{id}")
            const response = await axios.put(`${API_URL}/reservations/${id}`, reservationData);

            if (response.status === 200) {
                toast.success('Reservation updated successfully!');
                navigate('/allreservations');
            }
        } catch (error) {
            console.error('Update error:', error);
            toast.error('Failed to update reservation. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleBack = () => {
        navigate('/allreservations');
    };

    if (fetchingData) {
        return (
            <div className="min-h-screen bg-slate-100 flex items-center justify-center">
                <div className="text-center">
                    <svg className="animate-spin h-12 w-12 text-blue-600 mx-auto mb-4" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <p className="text-slate-600 text-lg">Loading reservation data...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-100 p-4 md:p-8">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                    <button onClick={handleBack} className="p-2 hover:bg-slate-200 rounded-lg transition-colors">
                        <ArrowLeft className="w-6 h-6 text-slate-700" />
                    </button>
                    <h1 className="text-2xl md:text-3xl font-bold text-slate-800">Edit Reservation</h1>
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 max-w-4xl mx-auto">
                <div className="space-y-6">
                    {/* Customer Name */}
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">Customer Name</label>
                        <div className="relative">
                            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                            <input
                                type="text"
                                name="customerName"
                                value={formData.customerName}
                                onChange={handleChange}
                                className={`w-full pl-11 pr-4 py-3 border-2 ${errors.customerName ? 'border-red-300' : 'border-slate-300'} rounded-lg focus:outline-none focus:border-blue-500`}
                                disabled={loading}
                            />
                        </div>
                        {errors.customerName && <p className="mt-1 text-sm text-red-600">{errors.customerName}</p>}
                    </div>

                    {/* Room Type */}
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">Room Type</label>
                        <div className="relative">
                            <Home className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                            <select
                                name="roomType"
                                value={formData.roomType}
                                onChange={handleChange}
                                className={`w-full pl-11 pr-4 py-3 border-2 ${errors.roomType ? 'border-red-300' : 'border-slate-300'} rounded-lg focus:outline-none focus:border-blue-500 bg-white`}
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

                    {/* Check-in and Check-out */}
                    <div className="grid md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Check-in Date</label>
                            <div className="relative">
                                <CalendarDays className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                                <input
                                    type="date"
                                    name="checkInDate"
                                    value={formData.checkInDate}
                                    onChange={handleChange}
                                    className={`w-full pl-11 pr-4 py-3 border-2 ${errors.checkInDate ? 'border-red-300' : 'border-slate-300'} rounded-lg focus:outline-none focus:border-blue-500`}
                                    disabled={loading}
                                />
                            </div>
                            {errors.checkInDate && <p className="mt-1 text-sm text-red-600">{errors.checkInDate}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Check-out Date</label>
                            <div className="relative">
                                <CalendarDays className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                                <input
                                    type="date"
                                    name="checkOutDate"
                                    value={formData.checkOutDate}
                                    onChange={handleChange}
                                    className={`w-full pl-11 pr-4 py-3 border-2 ${errors.checkOutDate ? 'border-red-300' : 'border-slate-300'} rounded-lg focus:outline-none focus:border-blue-500`}
                                    disabled={loading}
                                />
                            </div>
                            {errors.checkOutDate && <p className="mt-1 text-sm text-red-600">{errors.checkOutDate}</p>}
                        </div>
                    </div>

                    {/* Price */}
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">Total Price (LKR)</label>
                        <div className="relative">
                            <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                            <input
                                type="number"
                                name="totalPrice"
                                value={formData.totalPrice}
                                onChange={handleChange}
                                step="0.01"
                                min="0"
                                className={`w-full pl-11 pr-4 py-3 border-2 ${errors.totalPrice ? 'border-red-300' : 'border-slate-300'} rounded-lg focus:outline-none focus:border-blue-500`}
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
                            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold shadow-md hover:shadow-lg disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            {loading ? 'Updating...' : <><Save className="w-5 h-5" /> Update Reservation</>}
                        </button>
                        <button
                            onClick={() => fetchReservationData()}
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