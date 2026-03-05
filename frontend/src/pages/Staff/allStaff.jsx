import React, { useState, useEffect } from 'react';
import { ArrowLeft, Plus, Edit2, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function AllStaff() {
    const [staffList, setStaffList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentSlide, setCurrentSlide] = useState(0);
    const navigate = useNavigate();


    const API_URL = import.meta.env.VITE_BACKEND_URL_STAFF;

    const carouselImages = [
        '/staff_img1.webp',
        '/staff_img2.webp',
        '/staff_img3.webp',
    ];

    useEffect(() => {
        fetchStaff();
    }, []);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % carouselImages.length);
        }, 5000);
        return () => clearInterval(timer);
    }, []);

    const fetchStaff = async () => {
        try {
            setLoading(true);

            const token = localStorage.getItem("token");

            if (!token) {
                toast.error("Please login first");
                navigate("/");
                return;
            }

            const response = await axios.get(`${API_URL}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            console.log("Staff response:", response.data);

            setStaffList(
                Array.isArray(response.data.data)
                    ? response.data.data
                    : []
            );

        } catch (error) {

            console.error("Fetch staff error:", error);

            if (error.response?.status === 403) {
                toast.error("Unauthorized. Please login again.");
                navigate("/");
            } else {
                toast.error("Failed to fetch staff");
            }

            setStaffList([]);

        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {

        if (!window.confirm('Are you sure you want to delete this staff member?')) return;

        try {

            const token = localStorage.getItem("token");

            await axios.delete(`${API_URL}/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            toast.success('Staff member deleted successfully');
            fetchStaff();

        } catch (error) {

            console.error('Delete staff error:', error);
            toast.error('Failed to delete staff member');

        }
    };

    const handleEdit = (staffId) => navigate(`/editstaff/${staffId}`);
    const handleAddStaff = () => navigate('/addstaff');
    const handleBack = () => navigate('/dashboard');

    const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % carouselImages.length);
    const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + carouselImages.length) % carouselImages.length);
    const goToSlide = (index) => setCurrentSlide(index);

    return (
        <div className="min-h-screen bg-slate-100 p-4 md:p-8">

            {/* Header */}
            <div className="flex items-center gap-4 mb-6">
                <button
                    onClick={handleBack}
                    className="p-2 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
                >
                    <ArrowLeft className="w-6 h-6 text-slate-900" />
                </button>
                <h1 className="text-2xl md:text-3xl font-bold text-slate-900">Staff Management</h1>
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
                                    className={`absolute inset-0 transition-opacity duration-500 ${index === currentSlide ? 'opacity-100' : 'opacity-0'
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
                                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full transition-colors cursor-pointer"
                            >
                                <ChevronLeft className="w-6 h-6 text-slate-800" />
                            </button>
                            <button
                                onClick={nextSlide}
                                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full transition-colors cursor-pointer"
                            >
                                <ChevronRight className="w-6 h-6 text-slate-800" />
                            </button>

                            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                                {carouselImages.map((_, index) => (
                                    <button
                                        key={index}
                                        onClick={() => goToSlide(index)}
                                        className={`w-2 h-2 rounded-full transition-all cursor-pointer ${index === currentSlide
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
                        <h2 className="text-3xl font-bold text-slate-900 mb-4">Manage Staff</h2>
                        <br /><br /><br />
                        <p className="text-slate-700 mb-6">
                            View, edit, and manage all staff in your hotel. Keep track of staff status and details with ease.
                        </p>
                        <br />
                        <button
                            onClick={handleAddStaff}
                            className="bg-green-400 hover:bg-green-500 text-white py-4 px-8 rounded-2xl font-semibold text-lg transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center gap-2 w-full md:w-auto cursor-pointer"
                        >
                            <Plus className="w-6 h-6" />
                            Add Staff
                        </button>
                    </div>
                </div>

                {/* Staff Table */}
                <div className="p-6 md:p-8">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b-2 border-slate-200">
                                    <th className="text-left py-4 px-4 text-slate-700 font-semibold">Staff Id</th>
                                    <th className="text-left py-4 px-4 text-slate-700 font-semibold">Name</th>
                                    <th className="text-left py-4 px-4 text-slate-700 font-semibold">Email</th>
                                    <th className="text-left py-4 px-4 text-slate-700 font-semibold">Phone</th>
                                    <th className="text-left py-4 px-4 text-slate-700 font-semibold">Role</th>
                                    <th className="text-left py-4 px-4 text-slate-700 font-semibold">Salary</th>
                                    <th className="text-right py-4 px-4 text-slate-700 font-semibold">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr>
                                        <td colSpan="6" className="text-center py-12">
                                            <div className="flex justify-center items-center">
                                                <svg className="animate-spin h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                            </div>
                                        </td>
                                    </tr>
                                ) : staffList.length === 0 ? (
                                    <tr>
                                        <td colSpan="6" className="text-center py-12 text-slate-500">
                                            No staff found. Click "Add Staff" to create one.
                                        </td>
                                    </tr>
                                ) : (
                                    staffList.map((staff) => (
                                        <tr
                                            key={staff.id}
                                            className="border-b border-slate-100 hover:bg-slate-50 transition-colors"
                                        >
                                            <td className="py-4 px-4 text-slate-800">{staff.id}</td>
                                            <td className="py-4 px-4 text-slate-800">{staff.name}</td>
                                            <td className="py-4 px-4 text-slate-800">{staff.email}</td>
                                            <td className="py-4 px-4 text-slate-800">{staff.phone}</td>
                                            <td className="py-4 px-4 text-slate-800">{staff.role}</td>
                                            <td className="py-4 px-4 text-slate-800">{staff.salary}</td>
                                            <td className="py-4 px-4">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button
                                                        onClick={() => handleEdit(staff.id)}
                                                        className="p-2 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                                                        title="Edit Staff"
                                                    >
                                                        <Edit2 className="w-5 h-5 text-slate-600" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(staff.id)}
                                                        className="p-2 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                                                        title="Delete Staff"
                                                    >
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