import React, { useState } from 'react';
import {
    User,
    Mail,
    Phone,
    Shield,
    Lock,
    Save,
    X,
    ArrowLeft,
    DollarSign
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function AddStaff() {

    const navigate = useNavigate();

    const API_URL = import.meta.env.VITE_BACKEND_URL_STAFF;

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        role: '',
        password: '',
    });

    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    // Handle change
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

    // Validate form
    const validateForm = () => {

        const newErrors = {};

        if (!formData.name.trim()) {
            newErrors.name = 'Name is required';
        }

        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        }

        if (!formData.phone.trim()) {
            newErrors.phone = 'Phone is required';
        }

        if (!formData.role.trim()) {
            newErrors.role = 'Role is required';
        }

        if (!formData.salary.toString().trim()) {
            newErrors.salary = 'Salary is required';
        }

        // Password required only for admin
        if (formData.role === "admin" && !formData.password.trim()) {
            newErrors.password = 'Password is required for admin';
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
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            if (response.status === 200 || response.status === 201) {

                toast.success("Staff added successfully!");

                navigate("/allstaff");
            }

        } catch (error) {

            console.error("Add staff error:", error);

            if (error.response) {

                toast.error(
                    error.response.data.message ||
                    "Failed to add staff"
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
            name: '',
            email: '',
            phone: '',
            role: '',
            password: '',
        });

        setErrors({});
    };

    // Back
    const handleBack = () => {

        const hasData = Object.values(formData)
            .some(value => value !== '' && value !== 'ACTIVE');

        if (hasData && !window.confirm("Unsaved changes will be lost. Continue?")) {
            return;
        }

        navigate('/allstaff');
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
                    Add New Staff
                </h1>

            </div>

            {/* Form */}
            <div className="bg-white rounded-2xl shadow-lg p-8 max-w-4xl mx-auto">

                <div className="space-y-6">

                    {/* Name */}
                    <div>
                        <label className="block font-semibold mb-2">
                            Name *
                        </label>

                        <div className="relative">
                            <User className="absolute left-3 top-4 w-5 h-5 text-slate-400" />

                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className="w-full pl-10 py-3 border-2 border-gray-300 rounded-lg"
                                placeholder="Enter staff name"
                            />
                        </div>

                        {errors.name &&
                            <p className="text-red-500 text-sm">
                                {errors.name}
                            </p>}
                    </div>


                    {/* Email */}
                    <div>

                        <label className="block font-semibold mb-2">
                            Email *
                        </label>

                        <div className="relative">

                            <Mail className="absolute left-3 top-4 w-5 h-5 text-slate-400" />

                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full pl-10 py-3 border-2 border-gray-300 rounded-lg"
                                placeholder="Enter email"
                            />

                        </div>

                        {errors.email &&
                            <p className="text-red-500 text-sm">
                                {errors.email}
                            </p>}

                    </div>


                    {/* Phone */}
                    <div>

                        <label className="block font-semibold mb-2">
                            Phone *
                        </label>

                        <div className="relative">

                            <Phone className="absolute left-3 top-4 w-5 h-5 text-slate-400" />

                            <input
                                type="text"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                className="w-full pl-10 py-3 border-2 border-gray-300 rounded-lg"
                                placeholder="Enter phone"
                            />

                        </div>

                        {errors.phone &&
                            <p className="text-red-500 text-sm">
                                {errors.phone}
                            </p>}

                    </div>


                    {/* Role */}
                    <div>

                        <label className="block font-semibold mb-2">
                            Role *
                        </label>

                        <div className="relative">

                            <Shield className="absolute left-3 top-4 w-5 h-5 text-slate-400" />

                            <select
                                name="role"
                                value={formData.role}
                                onChange={handleChange}
                                className="w-full pl-10 py-3 border-2 border-gray-300 rounded-lg"
                            >

                                <option value="">Select role</option>
                                <option value="admin">Admin</option>
                                <option value="manager">Manager</option>
                                <option value="cleaner">Cleaner</option>
                                <option value="waiter">Waiter</option>
                                <option value="receptionist">Receptionist</option>
                                <option value="driver">Driver</option>

                            </select>

                        </div>

                    </div>

                    {/*Salary*/}
                    <div>
                        <label className="block font-semibold mb-2">
                            Salary *
                        </label>

                        <div className="relative">

                            <DollarSign className="absolute left-3 top-4 w-5 h-5 text-slate-400" />

                            <input
                                type="number"
                                name="salary"
                                value={formData.salary}
                                onChange={handleChange}
                                className="w-full pl-10 py-3 border-2 border-gray-300 rounded-lg"
                                placeholder="Enter salary"
                            />
                        </div>
                    </div>


                    {/* Password */}
                    {/* Password - show only when role is admin */}
                    {formData.role === "admin" && (
                        <div>
                            <label className="block font-semibold mb-2">
                                Password *
                            </label>

                            <div className="relative">
                                <Lock className="absolute left-3 top-3 w-5 h-5 text-slate-400" />

                                <input
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="w-full pl-10 py-3 border-2 border-gray-300 rounded-lg"
                                    placeholder="Enter admin password"
                                />
                            </div>

                            {errors.password &&
                                <p className="text-red-500 text-sm">
                                    {errors.password}
                                </p>}
                        </div>
                    )}


                    {/* Buttons */}
                    <div className="flex gap-4 pt-4">

                        <button
                            onClick={handleSubmit}
                            disabled={loading}
                            className="flex-1 bg-blue-600 text-white py-3 rounded-lg flex items-center justify-center gap-2 cursor-pointer"
                        >
                            <Save size={18} />
                            Save Staff
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