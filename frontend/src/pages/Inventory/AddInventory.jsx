import React, { useState } from 'react';
import { Package, Save, ArrowLeft, Tag, MapPin, Truck, Hash, DollarSign, AlertCircle } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function AddInventory() {
    const navigate = useNavigate();
    const API_URL = import.meta.env.VITE_BACKEND_URL_Inventory;

    const [formData, setFormData] = useState({
        itemName: '',
        category: 'EVENT_SUPPLY',
        quantity: '',
        unitPrice: '',
        reorderLevel: '',
        storageLocation: '',
        supplier: '',
        bookingDate: '',
        hallName: '',
        peopleCount: ''
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleDateChange = async (e) => {
    const selectedDate = e.target.value;
    setFormData({ ...formData, bookingDate: selectedDate });

    if (selectedDate) {
        try {
            // Adjust the URL to your Event Service date-search endpoint
            const response = await axios.get(`http://localhost:8083/api/events/date/${selectedDate}`);
            
            if (response.data && response.data.length > 0) {
                const event = response.data[0]; 
                setFormData(prev => ({
                    ...prev,
                    hallName: event.hallName,
                    peopleCount: event.peopleCount
                }));
                toast.success(`Event found: ${event.hallName}`);
            } else {
                toast.error("No events found for this date");
            }
        } catch (error) {
            console.error("Event Service error:", error);
        }
    }
};

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Convert strings to numbers for Spring Boot Validation
            const payload = {
                ...formData,
                quantity: parseInt(formData.quantity),
                unitPrice: parseFloat(formData.unitPrice),
                reorderLevel: parseInt(formData.reorderLevel)
            };

            await axios.post(API_URL, payload);
            toast.success("Item added to inventory!");
            navigate('/inventory'); // Navigate back to list
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.error || "Failed to add item. Check your inputs.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 p-4 md:p-8">
            <div className="max-w-3xl mx-auto">
                <div className="flex items-center gap-4 mb-8">
                    <button onClick={() => navigate(-1)} className="p-2 bg-white shadow-sm hover:bg-slate-100 rounded-lg transition-colors border border-slate-200">
                        <ArrowLeft className="w-6 h-6 text-slate-700" />
                    </button>
                    <h1 className="text-3xl font-bold text-slate-800">Add New Item</h1>
                </div>


                

                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-8">
                    <form onSubmit={handleSubmit} className="space-y-6">

{/* 1. Event Selection Section (Moved inside the card/form) */}
                        <div className="bg-blue-50 p-6 rounded-xl border border-blue-100 mb-8">
                            
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-2">Select Date</label>
                                    <input type="date" name="bookingDate" onChange={handleDateChange} className="w-full p-2.5 bg-white border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm" />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-2">Hall Name</label>
                                    <input type="text" value={formData.hallName} readOnly className="w-full p-2.5 bg-slate-50 border border-blue-100 rounded-lg text-slate-500 text-sm" placeholder="Auto-filled" />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-2">Expected People</label>
                                    <input type="number" value={formData.peopleCount} readOnly className="w-full p-2.5 bg-slate-50 border border-blue-100 rounded-lg text-slate-500 text-sm" placeholder="0" />
                                </div>
                            </div>
                        </div>

                        
                        
                        <div className="grid md:grid-cols-2 gap-6">
                            {/* Item Name */}
                            <div className="col-span-2 md:col-span-1">
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Item Name *</label>
                                <div className="relative">
                                    <Package className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                    <input required type="text" name="itemName" value={formData.itemName} onChange={handleChange} className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="e.g. Folding Chair" />
                                </div>
                            </div>

                            {/* Category */}
                            <div className="col-span-2 md:col-span-1">
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Category *</label>
                                <div className="relative">
                                    <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                    <select required name="category" value={formData.category} onChange={handleChange} className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none appearance-none">
                                        <option value="EVENT_SUPPLY">Event Supply</option>
                                        <option value="FURNITURE">Furniture</option>
                                        <option value="ELECTRONICS">Electronics</option>
                                        <option value="CONSUMABLES">Consumables</option>
                                    </select>
                                </div>
                            </div>

                            {/* Quantity */}
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Initial Quantity *</label>
                                <div className="relative">
                                    <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                    <input required type="number" min="0" name="quantity" value={formData.quantity} onChange={handleChange} className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="0" />
                                </div>
                            </div>

                            {/* Unit Price */}
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Unit Price ($) *</label>
                                <div className="relative">
                                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                    <input required type="number" step="0.01" min="0.01" name="unitPrice" value={formData.unitPrice} onChange={handleChange} className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="0.00" />
                                </div>
                            </div>

                            {/* Reorder Level */}
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Reorder Alert Level *</label>
                                <div className="relative">
                                    <AlertCircle className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                    <input required type="number" min="1" name="reorderLevel" value={formData.reorderLevel} onChange={handleChange} className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="e.g. 20" />
                                </div>
                            </div>

                            {/* Storage Location */}
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Storage Location</label>
                                <div className="relative">
                                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                    <input type="text" name="storageLocation" value={formData.storageLocation} onChange={handleChange} className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="e.g. Aisle 4, Shelf B" />
                                </div>
                            </div>

                            {/* Supplier */}
                            <div className="col-span-2">
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Supplier Name</label>
                                <div className="relative">
                                    <Truck className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                    <input type="text" name="supplier" value={formData.supplier} onChange={handleChange} className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Supplier Company Ltd." />
                                </div>
                            </div>
                        </div>

                        <button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-xl font-bold shadow-lg transition-all flex justify-center items-center gap-2 mt-8 disabled:opacity-70">
                            {loading ? 'Saving...' : <><Save className="w-5 h-5" /> Save Inventory Item</>}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}