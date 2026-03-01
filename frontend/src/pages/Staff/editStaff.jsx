import React, { useState, useEffect } from 'react';
import {
    User,
    Mail,
    Phone,
    Shield,
    Lock,
    Save,
    X,
    ArrowLeft
} from 'lucide-react';

import { toast } from 'react-hot-toast';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

export default function EditStaff() {

    const navigate = useNavigate();
    const { id } = useParams();

    const API_URL = import.meta.env.VITE_BACKEND_URL_STAFF;

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        role: '',
        password: '',
        status: 'ACTIVE'
    });

    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [fetchLoading, setFetchLoading] = useState(true);

    // Fetch staff by ID
    useEffect(() => {

        const fetchStaff = async () => {

            try {

                const token = localStorage.getItem("token");

                const response = await axios.get(
                    `${API_URL}/${id}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );

                setFormData({
                    name: response.data.name || '',
                    email: response.data.email || '',
                    phone: response.data.phone || '',
                    role: response.data.role || '',
                    password: '',
                    status: response.data.status || 'ACTIVE'
                });

            } catch (error) {

                toast.error("Failed to load staff data");
                navigate("/allstaff");

            } finally {

                setFetchLoading(false);

            }

        };

        fetchStaff();

    }, [id, navigate]);

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

    // Validate
    const validateForm = () => {

        const newErrors = {};

        if (!formData.name.trim())
            newErrors.name = "Name is required";

        if (!formData.email.trim())
            newErrors.email = "Email is required";

        if (!formData.phone.trim())
            newErrors.phone = "Phone is required";

        if (!formData.role.trim())
            newErrors.role = "Role is required";

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;

    };

    // Update staff
    const handleSubmit = async (e) => {

        e.preventDefault();

        if (!validateForm()) {
            toast.error("Please fix errors");
            return;
        }

        setLoading(true);

        try {

            const token = localStorage.getItem("token");

            await axios.put(
                `${API_URL}/${id}`,
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            toast.success("Staff updated successfully!");

            navigate("/allstaff");

        } catch (error) {

            toast.error(
                error.response?.data?.message ||
                "Update failed"
            );

        } finally {

            setLoading(false);

        }

    };

    const handleBack = () => {

        navigate("/allstaff");

    };

    if (fetchLoading)
        return <div className="p-10 text-center">Loading...</div>;

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
                    Edit Staff
                </h1>

            </div>

            {/* Form */}
            <div className="bg-white rounded-2xl shadow-lg p-8 max-w-4xl mx-auto">

                <div className="space-y-6">

                    {/* Name */}
                    <InputField
                        icon={User}
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Enter staff name"
                        error={errors.name}
                        label="Name *"
                    />

                    {/* Email */}
                    <InputField
                        icon={Mail}
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Enter email"
                        error={errors.email}
                        label="Email *"
                    />

                    {/* Phone */}
                    <InputField
                        icon={Phone}
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="Enter phone"
                        error={errors.phone}
                        label="Phone *"
                    />

                    {/* Role */}
                    <div>
                        <label className="font-semibold">Role *</label>

                        <select
                            name="role"
                            value={formData.role}
                            onChange={handleChange}
                            className="w-full py-3 border-2 border-gray-300 rounded-lg mt-2"
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

                    {/* Status */}
                    <div>
                        <label className="font-semibold">Status</label>

                        <select
                            name="status"
                            value={formData.status}
                            onChange={handleChange}
                            className="w-full py-3 border-2 border-gray-300 rounded-lg mt-2"
                        >
                            <option value="ACTIVE">Active</option>
                            <option value="INACTIVE">Inactive</option>
                        </select>
                    </div>

                    {/* Button */}
                    <button
                        onClick={handleSubmit}
                        disabled={loading}
                        className="w-full bg-blue-600 text-white py-3 rounded-lg flex justify-center items-center gap-2 cursor-pointer"
                    >
                        <Save size={18} />
                        Update Staff
                    </button>

                </div>

            </div>

        </div>

    );

}


// reusable input component
function InputField({ icon: Icon, label, name, value, onChange, placeholder, error }) {

    return (

        <div>

            <label className="font-semibold">
                {label}
            </label>

            <div className="relative mt-2">

                <Icon className="absolute left-3 top-3 w-5 h-5 text-slate-400" />

                <input
                    name={name}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    className="w-full pl-10 py-3 border-2 border-gray-300 rounded-lg"
                />

            </div>

            {error && (
                <p className="text-red-500 text-sm">
                    {error}
                </p>
            )}

        </div>

    );

}