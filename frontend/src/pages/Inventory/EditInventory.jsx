import React, { useState, useEffect } from 'react';
import { Package, Save, ArrowLeft, Tag, MapPin, Truck, Hash, DollarSign, AlertCircle, Calendar } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

export default function EditInventory() {
    const { id } = useParams(); 
    const navigate = useNavigate();
    const API_URL = import.meta.env.VITE_BACKEND_URL_Inventory;

    const [formData, setFormData] = useState({
        itemName: '',
        category: '',
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
    const [fetching, setFetching] = useState(true);

    // Fetch existing data on load
    useEffect(() => {
        const fetchItemData = async () => {
            try {
                const response = await axios.get(`${API_URL}/${id}`);
                const data = response.data;
                setFormData({
                    itemName: data.itemName,
                    category: data.category,
                    quantity: data.quantity.toString(),
                    unitPrice: data.unitPrice.toString(),
                    reorderLevel: data.reorderLevel.toString(),
                    storageLocation: data.storageLocation || '',
                    supplier: data.supplier || '',
                    bookingDate: data.bookingDate || '',
                    hallName: data.hallName || '',
                    peopleCount: data.peopleCount || ''
                });
            } catch (error) {
                toast.error("Failed to load item data");
                navigate('/inventory');
            } finally {
                setFetching(false);
            }
        };
        fetchItemData();
    }, [id, navigate, API_URL]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleDateChange = async (e) => {
        const selectedDate = e.target.value;
        setFormData({ ...formData, bookingDate: selectedDate });

        if (selectedDate) {
            try {
                // Adjust this URL to match your Event Service endpoint
                const response = await axios.get(`http://localhost:8083/api/events/date/${selectedDate}`);
                
                if (response.data && response.data.length > 0) {
                    const event = response.data[0]; 
                    setFormData(prev => ({
                        ...prev,
                        hallName: event.hallName,
                        peopleCount: event.peopleCount
                    }));
                    toast.success(`Event linked: ${event.hallName}`);
                } else {
                    setFormData(prev => ({ ...prev, hallName: '', peopleCount: '' }));
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
            const payload = {
                ...formData,
                quantity: parseInt(formData.quantity),
                unitPrice: parseFloat(formData.unitPrice),
                reorderLevel: parseInt(formData.reorderLevel),
                peopleCount: formData.peopleCount ? parseInt(formData.peopleCount) : 0
            };

            await axios.put(`${API_URL}/${id}`, payload);
            toast.success("Item updated successfully!");
            navigate('/inventory');
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.error || "Failed to update item.");
        } finally {
            setLoading(false);
        }
    };

    if (fetching) return <div className="text-center p-12 text-slate-500 text-lg">Loading item details...</div>;

    return (
        <div className="min-h-screen bg-slate-50 p-4 md:p-8">
            <div className="max-w-3xl mx-auto">
                <div className="flex items-center gap-4 mb-8">
                    <button onClick={() => navigate(-1)} className="p-2 bg-white shadow-sm hover:bg-slate-100 rounded-lg transition-colors border border-slate-200">
                        <ArrowLeft className="w-6 h-6 text-slate-700" />
                    </button>
                    <h1 className="text-3xl font-bold text-slate-800">Edit Item Details</h1>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-8">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        
                        {/* Event Linkage Section */}
                        <div className="bg-blue-50 p-6 rounded-xl border border-blue-100 mb-8">
                            <h3 className="text-blue-900 font-bold mb-4 flex items-center gap-2 text-sm uppercase tracking-wider">
                                <Calendar className="w-4 h-4" /> Linked Event Info
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-blue-700 mb-1">Event Date</label>
                                    <input 
                                        type="date" 
                                        name="bookingDate" 
                                        value={formData.bookingDate} 
                                        onChange={handleDateChange} 
                                        className="w-full p-2.5 bg-white border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm" 
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-blue-700 mb-1">Hall Name</label>
                                    <input type="text" value={formData.hallName} readOnly className="w-full p-2.5 bg-slate-100 border border-blue-100 rounded-lg text-slate-500 text-sm" placeholder="No event linked" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-blue-700 mb-1">Expected People</label>
                                    <input type="number" value={formData.peopleCount} readOnly className="w-full p-2.5 bg-slate-100 border border-blue-100 rounded-lg text-slate-500 text-sm" placeholder="0" />
                                </div>
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                            {/* Item Name */}
                            <div className="col-span-2 md:col-span-1">
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Item Name *</label>
                                <div className="relative">
                                    <Package className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                    <input required type="text" name="itemName" value={formData.itemName} onChange={handleChange} className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
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
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Current Quantity *</label>
                                <div className="relative">
                                    <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                    <input required type="number" min="0" name="quantity" value={formData.quantity} onChange={handleChange} className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                                </div>
                            </div>

                            {/* Unit Price */}
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Unit Price ($) *</label>
                                <div className="relative">
                                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                    <input required type="number" step="0.01" min="0.01" name="unitPrice" value={formData.unitPrice} onChange={handleChange} className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                                </div>
                            </div>

                            {/* Reorder Level */}
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Reorder Alert Level *</label>
                                <div className="relative">
                                    <AlertCircle className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                    <input required type="number" min="1" name="reorderLevel" value={formData.reorderLevel} onChange={handleChange} className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                                </div>
                            </div>

                            {/* Storage Location */}
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Storage Location</label>
                                <div className="relative">
                                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                    <input type="text" name="storageLocation" value={formData.storageLocation} onChange={handleChange} className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                                </div>
                            </div>

                            {/* Supplier */}
                            <div className="col-span-2">
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Supplier Name</label>
                                <div className="relative">
                                    <Truck className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                    <input type="text" name="supplier" value={formData.supplier} onChange={handleChange} className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                                </div>
                            </div>
                        </div>

                        <button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-xl font-bold shadow-lg transition-all flex justify-center items-center gap-2 mt-8 disabled:opacity-70">
                            {loading ? 'Updating...' : <><Save className="w-5 h-5" /> Update Item</>}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}