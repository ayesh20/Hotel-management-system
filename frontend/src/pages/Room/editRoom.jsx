import React, { useState, useEffect } from 'react';
import { Home, DollarSign, Save, X, ArrowLeft, Hash } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

export default function EditRoom() {
    const [formData, setFormData] = useState({
        roomNumber: '',
        roomSpecify: '',
        roomType: '',
        price: '',
        status: 'AVAILABLE'
    });
    
    const navigate = useNavigate();
    const { id } = useParams(); 
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [fetchingRoom, setFetchingRoom] = useState(true);
    
    const API_URL = import.meta.env.VITE_BACKEND_URL;

    
    useEffect(() => {
        fetchRoomData();
    }, [id]);

    const fetchRoomData = async () => {
        try {
            setFetchingRoom(true);
            console.log('Fetching room data for ID:', id);
            const response = await axios.get(`${API_URL}/rooms/${id}`);
            console.log('Room data:', response.data);
            
            setFormData({
                roomNumber: response.data.roomNumber,
                roomSpecify: response.data.roomSpecify,
                roomType: response.data.roomType || '',
                price: response.data.price.toString(),
                status: response.data.status
            });
        } catch (error) {
            console.error('Fetch room error:', error);
            toast.error('Failed to fetch room data');
           
        } finally {
            setFetchingRoom(false);
        }
    };
    
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

        if (!formData.roomNumber.trim()) {
            newErrors.roomNumber = 'Room number is required';
        }

        if (!formData.roomSpecify.trim()) {
            newErrors.roomSpecify = 'Room specification is required';
        }

        if (!formData.roomType.trim()) {
            newErrors.roomType = 'Room type is required';
        }

        if (!formData.price) {
            newErrors.price = 'Price is required';
        } else if (isNaN(formData.price) || parseFloat(formData.price) <= 0) {
            newErrors.price = 'Price must be a positive number';
        }

        if (!formData.status) {
            newErrors.status = 'Status is required';
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
            const roomData = {
                roomNumber: formData.roomNumber,
                roomSpecify: formData.roomSpecify,
                roomType: formData.roomType,
                price: parseFloat(formData.price),
                status: formData.status
            };

            console.log('Updating room:', roomData);
            const response = await axios.put(
                `${API_URL}/rooms/update/${id}`,
                roomData
            );

            if (response.status === 200) {
                toast.success('Room updated successfully!');
                navigate('/allrooms');
            }
        } catch (error) {
            console.error('Update room error:', error);
            
            if (error.response) {
                const errorMsg = error.response.data.message || 'Failed to update room. Please try again.';
                toast.error(errorMsg);
            } else if (error.request) {
                toast.error('Unable to connect to server. Please check your connection.');
            } 
        } finally {
            setLoading(false);
        }
    };

    const handleReset = () => {
        fetchRoomData(); // Reset to original data
        setErrors({});
        toast.info('Form reset to original values');
    };

    const handleBack = () => {
        navigate('/allrooms');
    };

    if (fetchingRoom) {
        return (
            <div className="min-h-screen bg-slate-100 flex items-center justify-center">
                <div className="text-center">
                    <svg className="animate-spin h-12 w-12 text-blue-600 mx-auto mb-4" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <p className="text-slate-600 text-lg">Loading room data...</p>
                </div>
            </div>
        );
    }

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
                        Edit Room
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
                            <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                            <input
                                type="text"
                                name="roomNumber"
                                value={formData.roomNumber}
                                onChange={handleChange}
                                className={`w-full pl-11 pr-4 py-3 border-2 ${errors.roomNumber ? 'border-red-300' : 'border-slate-300'} rounded-lg focus:outline-none focus:border-blue-500 transition-colors text-slate-800 placeholder-slate-400`}
                                placeholder="Enter room number (e.g., 101, A-204)"
                                disabled={loading}
                            />
                        </div>
                        {errors.roomNumber && (
                            <p className="mt-1 text-sm text-red-600">{errors.roomNumber}</p>
                        )}
                    </div>

                    {/* Room Specification */}
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                            Room Specification <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                            <Home className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                            <select
                                name="roomSpecify"
                                value={formData.roomSpecify}
                                onChange={handleChange}
                                className={`w-full pl-11 pr-4 py-3 border-2 ${errors.roomSpecify ? 'border-red-300' : 'border-slate-300'} rounded-lg focus:outline-none focus:border-blue-500 transition-colors text-slate-800 bg-white`}
                                disabled={loading}
                            >
                                <option value="">Select room specification</option>
                                <option value="AC">AC</option>
                                <option value="Non-AC">Non-AC</option>
                                <option value="AC with Bar">AC with Bar</option>
                                <option value="Standard">Standard</option>
                            </select>
                        </div>
                        {errors.roomSpecify && (
                            <p className="mt-1 text-sm text-red-600">{errors.roomSpecify}</p>
                        )}
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
                                <option value="Triple">Family</option>
                               
                            </select>
                        </div>
                        {errors.roomType && (
                            <p className="mt-1 text-sm text-red-600">{errors.roomType}</p>
                        )}
                    </div>

                    {/* Price */
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                            Price (LKR) <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                            <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                            <input
                                type="number"
                                name="price"
                                value={formData.price}
                                onChange={handleChange}
                                step="0.01"
                                min="0"
                                className={`w-full pl-11 pr-4 py-3 border-2 ${errors.price ? 'border-red-300' : 'border-slate-300'} rounded-lg focus:outline-none focus:border-blue-500 transition-colors text-slate-800 placeholder-slate-400`}
                                placeholder="Enter price per month"
                                disabled={loading}
                            />
                        </div>
                        {errors.price && (
                            <p className="mt-1 text-sm text-red-600">{errors.price}</p>
                        )}
                    </div>
}
                    {/* Status */}
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                            Status <span className="text-red-500">*</span>
                        </label>
                        <select
                            name="status"
                            value={formData.status}
                            onChange={handleChange}
                            className={`w-full px-4 py-3 border-2 ${errors.status ? 'border-red-300' : 'border-slate-300'} rounded-lg focus:outline-none focus:border-blue-500 transition-colors text-slate-800 bg-white`}
                            disabled={loading}
                        >
                            <option value="AVAILABLE">Available</option>
                            <option value="OCCUPIED">Occupied</option>
                            <option value="MAINTENANCE">Under Maintenance</option>
                            <option value="RESERVED">Reserved</option>
                        </select>
                        {errors.status && (
                            <p className="mt-1 text-sm text-red-600">{errors.status}</p>
                        )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 pt-6">
                        <button
                            onClick={handleSubmit}
                            disabled={loading}
                            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Updating...
                                </>
                            ) : (
                                <>
                                    <Save className="w-5 h-5" />
                                    Update Room
                                </>
                            )}
                        </button>

                        <button
                            onClick={handleReset}
                            disabled={loading}
                            className="flex-1 bg-slate-200 hover:bg-slate-300 text-slate-700 py-3 rounded-lg font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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