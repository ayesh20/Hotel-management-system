import React, { useState, useEffect } from 'react';
import { ArrowLeft, Plus, Edit2, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function AllCleaners() {

    const [housekeeping, setHouseKeeping] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentSlide, setCurrentSlide] = useState(0);
    const navigate = useNavigate();
    
    const API_URL = import.meta.env.VITE_BACKEND_URL;
    
    const carouselImages = [
        '/image1.jpg',
        '/image2.jpg',
        '/image3.jpg',
    ];

    useEffect(() => {
        fetchCleaners();
    }, []);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % carouselImages.length);
        }, 5000);
        
        return () => clearInterval(timer);
    }, []);

    const fetchCleaners = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${API_URL}/housekeeping`);
            setHouseKeeping(response.data);
        } catch (error) {
            toast.error('Failed to fetch rooms');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this cleaning task?')) return;

        try {
            await axios.delete(`${API_URL}/housekeeping/${id}`);
            toast.success('cleaning task deleted successfully');
            fetchCleaners();
        } catch (error) {
            toast.error('Failed to delete cleaning task');
        }
    };

    const handleEdit = (id) => {
        navigate(`/editCleaner/${id}`);
    };

    const handleAddRoom = () => {
        navigate('/addCleaner');
    };

    const handleBack = () => {
        navigate('/dashboard');
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

    const getStatusColor = (status) => {
    const normalizedStatus = status?.toUpperCase();

    const colors = {
        PENDING: 'bg-yellow-100 text-yellow-800',
        COMPLETED: 'bg-green-100 text-green-800',
        CANCELLED: 'bg-red-100 text-red-800',
    };

    return colors[normalizedStatus] || 'bg-gray-100 text-gray-800';
};


    return (
        <div className="min-h-screen bg-slate-100 p-4 md:p-8">
            {/* Header */}
            <div className="flex items-center gap-4 mb-6">
                <button 
                    onClick={handleBack}
                    className="p-2 hover:bg-slate-200 rounded-lg transition-colors"
                >
                    <ArrowLeft className="w-6 h-6 text-slate-900" />
                </button>
                <h1 className="text-2xl md:text-3xl font-bold text-slate-900">
                    HouseKeeping
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
                                        alt={`Room ${index + 1}`}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            ))}
    
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
    
                    {/* Right Side */}
                    <div className="p-8 md:p-12 flex flex-col justify-center">
                        <h2 className="text-3xl font-bold text-slate-900 mb-4">Manage Your Cleaners</h2>
                        <br /><br /><br />
                        <p className="text-slate-700 mb-6">
                            View, edit, and manage all cleaners in your hotel. Keep track of cleaners status and details with ease.
                        </p>
                        <br />
                        <button
                            onClick={handleAddRoom}
                            className="bg-green-400 hover:bg-green-500 text-white py-4 px-8 rounded-2xl font-semibold text-lg transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center gap-2 w-full md:w-auto"
                        >
                            <Plus className="w-6 h-6" />
                            Add Cleaner
                        </button>
                    </div>
                </div>
    
                {/* Table */}
                <div className="p-6 md:p-8">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b-2 border-slate-200">
                                    <th className="text-left py-4 px-4">Room Number</th>
                                    <th className="text-left py-4 px-4">Cleaner ID</th>
                                    <th className="text-left py-4 px-4">Date</th>
                                    <th className="text-left py-4 px-4">Status</th>
                                    <th className="text-left py-4 px-4">Remark</th>
                                    <th className="text-right py-4 px-4">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr>
                                        <td colSpan="6" className="text-center py-12">Loading...</td>
                                    </tr>
                                ) : housekeeping.length === 0 ? (
                                    <tr>
                                        <td colSpan="6" className="text-center py-12 text-slate-500">
                                            No rooms found. Click "Add Cleaner" to create one.
                                        </td>
                                    </tr>
                                ) : (
                                    housekeeping.map((houseKeeping) => (
                                        <tr key={houseKeeping.id} className="border-b hover:bg-slate-50">
                                            <td className="py-4 px-4">{houseKeeping.roomNumber}</td>
                                            <td className="py-4 px-4">{houseKeeping.staffId}</td>
                                            <td className="py-4 px-4">{houseKeeping.cleaningDate}</td>
                                            <td className="py-4 px-4">
                                                <span className={`px-3 py-1 rounded-full text-xs ${getStatusColor(houseKeeping.status)}`}>
                                                    {houseKeeping.status}
                                                </span>
                                            </td>
                                            <td className="py-4 px-4">{houseKeeping.remarks}</td>
                                            <td className="py-4 px-4 text-right">
                                                <div className="flex justify-end gap-2">
                                                    <button onClick={() => handleEdit(houseKeeping.id)}>
                                                        <Edit2 className="w-5 h-5 text-slate-600" />
                                                    </button>
                                                    <button onClick={() => handleDelete(houseKeeping.id)}>
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

export default AllCleaners;
