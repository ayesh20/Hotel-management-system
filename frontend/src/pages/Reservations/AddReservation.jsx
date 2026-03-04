import React, { useState, useEffect } from 'react';
import { Home, DollarSign, Save, X, ArrowLeft, User, CalendarDays, Hash, Info } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function AddReservation() {
    const [allRooms, setAllRooms] = useState([]);
    const [allCustomers, setAllCustomers] = useState([]); 
    const [availableRoomNumbers, setAvailableRoomNumbers] = useState([]);

    const [formData, setFormData] = useState({
        customerId: '',   
        customerName: '', 
        roomType: '',
        roomNumber: '', 
        roomId: '',     
        roomSpecify: '', 
        checkInDate: '',
        checkOutDate: '',
        totalPrice: ''   
    });
    
    const navigate = useNavigate();
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    
    const API_URL = import.meta.env.VITE_BACKEND_URL2;

    useEffect(() => {
        const fetchData = async () => {
            try {
                const roomsResponse = await axios.get(`${API_URL}/reservations/check-rooms`);
                setAllRooms(roomsResponse.data);
            } catch (error) { toast.error("Could not load available rooms"); }

            try {
                const customersResponse = await axios.get(`${API_URL}/reservations/check-customers`);
                setAllCustomers(customersResponse.data);
            } catch (error) { toast.error("Could not load customer list"); }
        };
        fetchData();
    }, [API_URL]);

    const handleCustomerChange = (e) => {
        const selectedId = e.target.value;
        const selectedCustomer = allCustomers.find(c => c.id === selectedId);
        
        if (selectedCustomer) {
            setFormData(prev => ({
                ...prev,
                customerId: selectedCustomer.id,
                customerName: selectedCustomer.fullName 
            }));
            setErrors(prev => ({...prev, customerId: ''}));
        } else {
            setFormData(prev => ({ ...prev, customerId: '', customerName: '' }));
        }
    };

    const handleTypeChange = (e) => {
        const selectedType = e.target.value;
        setFormData(prev => ({ ...prev, roomType: selectedType, roomNumber: '', roomId: '', roomSpecify: '', totalPrice: '' }));
        const filtered = allRooms.filter(room => room.roomType === selectedType && room.status === 'AVAILABLE');
        setAvailableRoomNumbers(filtered);
    };

    const handleRoomNumberChange = (e) => {
        const selectedId = e.target.value;
        const selectedRoom = allRooms.find(r => r.id === selectedId);
        if (selectedRoom) {
            setFormData(prev => ({
                ...prev, roomId: selectedRoom.id, roomNumber: selectedRoom.roomNumber, roomSpecify: selectedRoom.roomSpecify, totalPrice: selectedRoom.price 
            }));
            setErrors(prev => ({...prev, roomNumber: '', totalPrice: ''}));
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.customerId) newErrors.customerId = 'Customer selection is required';
        if (!formData.roomType) newErrors.roomType = 'Room type is required';
        if (!formData.roomNumber) newErrors.roomNumber = 'Room selection is required';
        if (!formData.checkInDate) newErrors.checkInDate = 'Check-in date is required';
        if (!formData.checkOutDate) newErrors.checkOutDate = 'Check-out date is required';
        
        if (formData.checkInDate && formData.checkOutDate) {
            if (new Date(formData.checkOutDate) <= new Date(formData.checkInDate)) {
                newErrors.checkOutDate = 'Check-out must be after Check-in';
            }
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) { toast.error('Please fix errors'); return; }

        setLoading(true);
        try {
            const response = await axios.post(`${API_URL}/reservations`, formData);
            
            // Extract the generated ID safely
            const generatedReservationId = response.data.id || response.data.reservationId || response.data._id;
            
            if (!generatedReservationId) {
                console.error("Backend Response:", response.data);
                toast.error("Critical Error: Backend did not return an ID!");
                setLoading(false);
                return;
            }

            toast.success('Reservation successful!');
            
            // Prepare data for the payment screen
            const paymentData = {
                reservationId: generatedReservationId, 
                customerId: formData.customerId,
                customerName: formData.customerName,
                totalPrice: formData.totalPrice
            };

            // 🔥 BULLETPROOF FIX: Save to Session Storage to survive page refreshes
            sessionStorage.setItem('pendingPaymentData', JSON.stringify(paymentData));

            navigate('/payment', { state: paymentData });

        } catch (error) {
            toast.error('Failed to save reservation');
        } finally {
            setLoading(false);
        }
    };

    const uniqueRoomTypes = [...new Set(allRooms.map(item => item.roomType))];

    return (
        <div className="min-h-screen bg-slate-100 p-4 md:p-8">
            <div className="flex items-center gap-4 mb-6">
                <button onClick={() => navigate('/allreservations')} className="p-2 hover:bg-slate-200 rounded-lg">
                    <ArrowLeft className="w-6 h-6 text-slate-700" />
                </button>
                <h1 className="text-2xl font-bold text-slate-800">New Reservation</h1>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 max-w-4xl mx-auto">
                <div className="space-y-6">
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">Registered Customer *</label>
                        <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                            <select name="customerId" value={formData.customerId} onChange={handleCustomerChange} className="w-full pl-11 pr-4 py-3 border-2 border-slate-300 rounded-lg focus:border-blue-500 bg-white">
                                <option value="">Select Existing Customer</option>
                                {allCustomers.map(c => <option key={c.id} value={c.id}>{c.fullName} - {c.nicOrPassport}</option>)}
                            </select>
                        </div>
                        {errors.customerId && <p className="text-red-500 text-sm mt-1">{errors.customerId}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">Room Type *</label>
                        <div className="relative">
                            <Home className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                            <select name="roomType" value={formData.roomType} onChange={handleTypeChange} className="w-full pl-11 pr-4 py-3 border-2 border-slate-300 rounded-lg focus:border-blue-500 bg-white">
                                <option value="">Select Type</option>
                                {uniqueRoomTypes.map(type => <option key={type} value={type}>{type}</option>)}
                            </select>
                        </div>
                        {errors.roomType && <p className="text-red-500 text-sm mt-1">{errors.roomType}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">Available Room Number *</label>
                        <div className="relative">
                            <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                            <select name="roomId" value={formData.roomId} onChange={handleRoomNumberChange} disabled={!formData.roomType} className="w-full pl-11 pr-4 py-3 border-2 border-slate-300 rounded-lg focus:border-blue-500 bg-white disabled:bg-slate-100">
                                <option value="">Select Room</option>
                                {availableRoomNumbers.map(r => <option key={r.id} value={r.id}>{r.roomNumber} - {r.roomSpecify} (LKR {r.price})</option>)}
                            </select>
                        </div>
                        {errors.roomNumber && <p className="text-red-500 text-sm mt-1">{errors.roomNumber}</p>}
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Specification</label>
                            <div className="relative">
                                <Info className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                <input type="text" value={formData.roomSpecify} readOnly className="w-full pl-11 pr-4 py-3 border-2 border-slate-200 bg-slate-50 rounded-lg text-slate-500" />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Total Price (LKR)</label>
                            <div className="relative">
                                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                <input type="text" value={formData.totalPrice} readOnly className="w-full pl-11 pr-4 py-3 border-2 border-slate-200 bg-slate-50 rounded-lg text-slate-500" />
                            </div>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Check-in Date *</label>
                            <input type="date" name="checkInDate" value={formData.checkInDate} onChange={handleChange} className="w-full px-4 py-3 border-2 border-slate-300 rounded-lg focus:border-blue-500" />
                            {errors.checkInDate && <p className="text-red-500 text-sm mt-1">{errors.checkInDate}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Check-out Date *</label>
                            <input type="date" name="checkOutDate" value={formData.checkOutDate} onChange={handleChange} className="w-full px-4 py-3 border-2 border-slate-300 rounded-lg focus:border-blue-500" />
                            {errors.checkOutDate && <p className="text-red-500 text-sm mt-1">{errors.checkOutDate}</p>}
                        </div>
                    </div>

                    <button onClick={handleSubmit} disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-lg font-bold shadow-lg transition-all flex justify-center items-center gap-2">
                        {loading ? 'Saving...' : <><Save className="w-5 h-5" /> Confirm Reservation</>}
                    </button>
                </div>
            </div>
        </div>
    );
}