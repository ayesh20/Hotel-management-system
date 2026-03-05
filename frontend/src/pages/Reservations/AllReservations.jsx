import React, { useState, useEffect } from 'react';
import { ArrowLeft, Plus, Edit2, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function AllReservations() {
    const [reservations, setReservations] = useState([]);
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentSlide, setCurrentSlide] = useState(0);
    const navigate = useNavigate();
    
    const API_URL = import.meta.env.VITE_BACKEND_URL2;
    
    const carouselImages = [
        '/image10.png',
        '/image11.png',
        '/image12.png',
    ];

    useEffect(() => {
        fetchData();
        
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % carouselImages.length);
        }, 5000);
        
        return () => clearInterval(timer);
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            
            // 1. Fetch Reservations
            const resResponse = await axios.get(`${API_URL}/reservations`);
            setReservations(resResponse.data);
            
            // 2. Fetch Payments
            const payResponse = await axios.get(`${API_URL}/reservations/check-payments`);
            setPayments(payResponse.data);
            
        } catch (error) {
            console.error('Fetch error:', error);
            toast.error('Failed to fetch data');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (reservationId) => {
        if (!window.confirm('Are you sure you want to delete this reservation?')) {
            return;
        }

        try {
            await axios.delete(`${API_URL}/reservations/${reservationId}`);
            toast.success('Reservation deleted successfully');
            fetchData();
        } catch (error) {
            console.error('Delete error:', error);
            toast.error('Failed to delete reservation');
        }
    };

    const nextSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % carouselImages.length);
    };

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev - 1 + carouselImages.length) % carouselImages.length);
    };

    const goToSlide = (index) => {
        setCurrentSlide(index);
    };

    return (
        <div className="min-h-screen bg-slate-100 p-4 md:p-8">
            {/* Header */}
            <div className="flex items-center gap-4 mb-6">
                <button 
                    onClick={() => navigate('/dashboard')}
                    className="p-2 hover:bg-slate-200 rounded-lg transition-colors"
                >
                    <ArrowLeft className="w-6 h-6 text-slate-900" />
                </button>
                <h1 className="text-2xl md:text-3xl font-bold text-slate-900">
                    Reservations
                </h1>
            </div>

            {/* Main Content Card */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden max-w-7xl mx-auto">
                <div className="grid md:grid-cols-2 gap-0">
                    {/* Left Side - Image Carousel */}
                    <div className="relative bg-slate-200 h-80 md:h-auto">
                        <div className="relative w-full h-full overflow-hidden">
                            {carouselImages.map((image, index) => (
                                <div
                                    key={index}
                                    className={`absolute inset-0 transition-opacity duration-500 ${
                                        index === currentSlide ? 'opacity-100' : 'opacity-0'
                                    }`}
                                >
                                    <img
                                        src={image}
                                        alt={`Slide ${index + 1}`}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            ))}

                            {/* Navigation Arrows */}
                            <button
                                onClick={prevSlide}
                                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full transition-colors"
                            >
                                <ChevronLeft className="w-6 h-6 text-slate-800" />
                            </button>
                            <button
                                onClick={nextSlide}
                                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full transition-colors"
                            >
                                <ChevronRight className="w-6 h-6 text-slate-800" />
                            </button>

                            {/* Dots Indicator */}
                            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                                {carouselImages.map((_, index) => (
                                    <button
                                        key={index}
                                        onClick={() => goToSlide(index)}
                                        className={`w-2 h-2 rounded-full transition-all ${
                                            index === currentSlide 
                                                ? 'bg-blue-500 w-6' 
                                                : 'bg-white/60 hover:bg-white'
                                        }`}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right Side - Text and Button */}
                    <div className="p-8 md:p-12 flex flex-col justify-center">
                        <h2 className="text-3xl font-bold text-slate-900 mb-4">Manage Reservations</h2>
                        <br></br><br></br><br></br>
                        <p className="text-slate-700 mb-6">
                            View, edit, and manage all customer reservations. Keep track of check-in and check-out dates with ease.
                        </p>
                        <br></br>
                        <button
                            onClick={() => navigate('/addreservation')}
                            className="bg-green-400 hover:bg-green-500 text-white py-4 px-8 rounded-2xl font-semibold text-lg transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center gap-2 w-full md:w-auto"
                        >
                            <Plus className="w-6 h-6" />
                            Add Reservation
                        </button>
                    </div>
                </div>

                {/* Reservations Table */}
                <div className="p-6 md:p-8">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b-2 border-slate-200">
                                    <th className="text-left py-4 px-4 text-slate-700 font-semibold">Customer Name</th>
                                    <th className="text-left py-4 px-4 text-slate-700 font-semibold">Type</th>
                                    <th className="text-left py-4 px-4 text-slate-700 font-semibold">Check-in</th>
                                    <th className="text-left py-4 px-4 text-slate-700 font-semibold">Check-out</th>
                                    <th className="text-left py-4 px-4 text-slate-700 font-semibold">Total Price</th>
                                    <th className="text-left py-4 px-4 text-slate-700 font-semibold">Status</th>
                                    <th className="text-right py-4 px-4 text-slate-700 font-semibold">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr>
                                        <td colSpan="7" className="text-center py-12">
                                            <div className="flex justify-center items-center">
                                                <svg className="animate-spin h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                            </div>
                                        </td>
                                    </tr>
                                ) : reservations.length === 0 ? (
                                    <tr>
                                        <td colSpan="7" className="text-center py-12 text-slate-500">
                                            No reservations found. Click "Add Reservation" to create one.
                                        </td>
                                    </tr>
                                ) : (
                                    reservations.map((reservation) => {
                                        // 1. Find the payment linked to this reservation ID
                                        const linkedPayment = payments.find(p => p.bookingId === reservation.id);
                                        
                                        // 2. Set default status
                                        let statusText = 'UNPAID';
                                        let badgeColor = 'bg-red-100 text-red-700'; 

                                        // 3. Determine the status text and colors safely
                                        if (linkedPayment && linkedPayment.paymentStatus) {
                                            const status = linkedPayment.paymentStatus.toUpperCase(); // Safety check

                                            
                                            if (status === 'PAID' || status === 'PAYMENT SUCCESS') {
                                                statusText = 'PAID';
                                                badgeColor = 'bg-green-100 text-green-700'; 
                                            } else if (status === 'PENDING') {
                                                statusText = 'PENDING';
                                                badgeColor = 'bg-yellow-100 text-yellow-700'; 
                                            }
                                        }

                                        return (
                                            <tr 
                                                key={reservation.id} 
                                                className="border-b border-slate-100 hover:bg-slate-50 transition-colors"
                                            >
                                                <td className="py-4 px-4 text-slate-800 font-medium">{reservation.customerName}</td>
                                                <td className="py-4 px-4 text-slate-800">{reservation.roomType}</td>
                                                <td className="py-4 px-4 text-slate-800">{reservation.checkInDate}</td>
                                                <td className="py-4 px-4 text-slate-800">{reservation.checkOutDate}</td>
                                                <td className="py-4 px-4 text-slate-800 font-semibold">LKR {parseFloat(reservation.totalPrice).toLocaleString()}</td>
                                                
                                                {/* Dynamic Payment Status Badge */}
                                                <td className="py-4 px-4">
                                                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${badgeColor}`}>
                                                        {statusText}
                                                    </span>
                                                </td>

                                                <td className="py-4 px-4">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <button
                                                            onClick={() => navigate(`/editreservation/${reservation.id}`)}
                                                            className="p-2 hover:bg-blue-50 rounded-lg transition-colors"
                                                            title="Edit Reservation"
                                                        >
                                                            <Edit2 className="w-5 h-5 text-slate-600" />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(reservation.id)}
                                                            className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                                                            title="Delete Reservation"
                                                        >
                                                            <Trash2 className="w-5 h-5 text-slate-600" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}