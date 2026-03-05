import React, { useState, useEffect } from 'react';
import {
    Truck,
    Hash,
    User,
    Phone,
    DollarSign,
    Activity,
    Save,
    X,
    ArrowLeft
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

export default function EditTransport() {

    const navigate = useNavigate();
    const { id } = useParams();
    const API_URL = import.meta.env.VITE_BACKEND_URL_TRANSPORT;

    const [formData, setFormData] = useState({
        vehicleType: '',
        vehicleNumber: '',
        driverName: '',
        driverContact: '',
        pricePerDay: '',
        status: 'AVAILABLE',
    });

    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [fetchLoading, setFetchLoading] = useState(true);

    // Fetch transport by ID
    useEffect(() => {
        const fetchTransport = async () => {
            try {
                const token = localStorage.getItem("token");
                const response = await axios.get(`${API_URL}/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                const transport = response.data;

                setFormData({
                    vehicleType: transport.vehicleType || '',
                    vehicleNumber: transport.vehicleNumber || '',
                    driverName: transport.driverName || '',
                    driverContact: transport.driverContact || '',
                    pricePerDay: transport.pricePerDay || '',
                    status: transport.status || 'AVAILABLE',
                });

            } catch (error) {
                toast.error("Failed to load transport data");
                navigate("/alltransport");
            } finally {
                setFetchLoading(false);
            }
        };

        fetchTransport();
    }, [id, navigate]);

    // Handle change
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));

        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    // Validate form
    const validateForm = () => {
        const newErrors = {};

        if (!formData.vehicleType.trim()) newErrors.vehicleType = "Vehicle type is required";
        if (!formData.vehicleNumber.trim()) newErrors.vehicleNumber = "Vehicle number is required";
        if (!formData.driverName.trim()) newErrors.driverName = "Driver name is required";
        if (!formData.driverContact.trim()) newErrors.driverContact = "Driver contact is required";
        if (!formData.pricePerDay.toString().trim()) newErrors.pricePerDay = "Price per day is required";
        if (!formData.status.trim()) newErrors.status = "Status is required";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Update transport
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) {
            toast.error("Please fix all errors before submitting");
            return;
        }

        setLoading(true);

        try {
            const token = localStorage.getItem("token");
            const response = await axios.put(`${API_URL}/${id}`, {
                ...formData,
                pricePerDay: Number(formData.pricePerDay)
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (response.status === 200 || response.status === 201) {
                toast.success("Transport updated successfully!");
                navigate("/alltransport");
            }

        } catch (error) {
            console.error("Update transport error:", error);
            toast.error(error.response?.data?.message || "Failed to update transport");
        } finally {
            setLoading(false);
        }
    };

    // Reset form
    const handleReset = () => {
        setFormData(prev => ({
            ...prev,
            vehicleType: '',
            vehicleNumber: '',
            driverName: '',
            driverContact: '',
            pricePerDay: '',
            status: 'AVAILABLE',
        }));
        setErrors({});
    };

    // Go back
    const handleBack = () => {
        const hasData = Object.values(formData)
            .some(value => value !== '' && value !== 'AVAILABLE');

        if (hasData && !window.confirm("Unsaved changes will be lost. Continue?")) {
            return;
        }
        navigate('/alltransport');
    };

    if (fetchLoading) return <div className="p-10 text-center">Loading...</div>;

    return (
        <div className="min-h-screen bg-slate-100 p-4 md:p-8">
            {/* Header */}
            <div className="flex items-center gap-2 mb-6">
                <button onClick={handleBack} className="p-2 hover:bg-slate-200 rounded-lg cursor-pointer">
                    <ArrowLeft className="w-6 h-6" />
                </button>
                <h1 className="text-2xl font-bold">Edit Transport</h1>
            </div>

            {/* Form */}
            <div className="bg-white rounded-2xl shadow-lg p-8 max-w-4xl mx-auto">
                <div className="space-y-6">

                    {/* Vehicle Type */}
                    <InputField
                        icon={Truck}
                        label="Vehicle Type *"
                        name="vehicleType"
                        value={formData.vehicleType}
                        onChange={handleChange}
                        placeholder="Van, Car, Bus..."
                        error={errors.vehicleType}
                    />

                    {/* Vehicle Number */}
                    <InputField
                        icon={Hash}
                        label="Vehicle Number *"
                        name="vehicleNumber"
                        value={formData.vehicleNumber}
                        onChange={handleChange}
                        placeholder="VD-2345"
                        error={errors.vehicleNumber}
                    />

                    {/* Driver Name */}
                    <InputField
                        icon={User}
                        label="Driver Name *"
                        name="driverName"
                        value={formData.driverName}
                        onChange={handleChange}
                        placeholder="Enter driver name"
                        error={errors.driverName}
                    />

                    {/* Driver Contact */}
                    <InputField
                        icon={Phone}
                        label="Driver Contact *"
                        name="driverContact"
                        value={formData.driverContact}
                        onChange={handleChange}
                        placeholder="0765665456"
                        error={errors.driverContact}
                    />

                    {/* Price Per Day */}
                    <InputField
                        icon={DollarSign}
                        label="Price Per Day *"
                        name="pricePerDay"
                        value={formData.pricePerDay}
                        onChange={handleChange}
                        placeholder="20000"
                        error={errors.pricePerDay}
                    />

                    {/* Status */}
                    <div>
                        <label className="block font-semibold mb-2">Status *</label>
                        <div className="relative">
                            <Activity className="absolute left-3 top-4 w-5 h-5 text-slate-400" />
                            <select
                                name="status"
                                value={formData.status}
                                onChange={handleChange}
                                className="w-full pl-10 py-3 border-2 border-gray-300 rounded-lg"
                            >
                                <option value="AVAILABLE">AVAILABLE</option>
                                <option value="UNAVAILABLE">UNAVAILABLE</option>
                                <option value="MAINTENANCE">MAINTENANCE</option>
                                <option value="REPAIR">REPAIR</option>
                                <option value="RESERVED">RESERVED</option>
                                <option value="OUT_OF_SERVICE">OUT OF SERVICE</option>
                            </select>
                        </div>
                        {errors.status && <p className="text-red-500 text-sm">{errors.status}</p>}
                    </div>

                    {/* Buttons */}
                    <div className="flex gap-4 pt-4">
                        <button
                            onClick={handleSubmit}
                            disabled={loading}
                            className="flex-1 bg-blue-600 text-white py-3 rounded-lg flex items-center justify-center gap-2 cursor-pointer"
                        >
                            <Save size={18} /> {loading ? "Updating..." : "Update Transport"}
                        </button>

                        <button
                            onClick={handleReset}
                            className="flex-1 bg-slate-200 py-3 rounded-lg flex items-center justify-center gap-2 cursor-pointer"
                        >
                            <X size={18} /> Reset
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
}

// Reusable input component
function InputField({ icon: Icon, label, name, value, onChange, placeholder, error }) {
    return (
        <div>
            <label className="font-semibold">{label}</label>
            <div className="relative mt-2">
                <Icon className="absolute left-3 top-4 w-5 h-5 text-slate-400" />
                <input
                    name={name}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    className="w-full pl-10 py-3 border-2 border-gray-300 rounded-lg"
                />
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
        </div>
    );
}