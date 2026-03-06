import React, { useState } from 'react';
import { Package, Save, ArrowLeft, Tag, MapPin, Truck, Hash, DollarSign, AlertCircle, Calendar, Users } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function AddInventory() {
    const navigate = useNavigate();
    const API_URL = import.meta.env.VITE_BACKEND_URL_Inventory;
    const EVENT_SERVICE_URL = import.meta.env.VITE_BACKEND_URL;

    const [formData, setFormData] = useState({
        itemName: '',
        category: 'EVENT_SUPPLY',
        quantity: '',
        unitPrice: '',
        reorderLevel: '',
        storageLocation: '',
        supplier: '',
        bookingDate: '',
        hallName: '',      // stored as hallName in InventoryItem, filled from event.hallSelection
        peopleCount: '',
        eventId: '',
    });

    const [loading, setLoading] = useState(false);
    const [eventLoading, setEventLoading] = useState(false);
    const [eventFound, setEventFound] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    /**
     * Fetches event by date.
     * Event entity fields: hallSelection, peopleCount, id
     */
    const handleDateChange = async (e) => {
        const selectedDate = e.target.value;

        setFormData(prev => ({
            ...prev,
            bookingDate: selectedDate,
            hallName: '',
            peopleCount: '',
            eventId: '',
        }));
        setEventFound(false);

        if (!selectedDate) return;

        setEventLoading(true);
        try {
            const response = await axios.get(`${EVENT_SERVICE_URL}/api/events/date/${selectedDate}`);
            console.log('[EventService] Raw response:', response.data);

            const dataArray = Array.isArray(response.data) ? response.data : [response.data];

            if (dataArray.length > 0) {
                const event = dataArray[0];

                // Event entity uses "hallSelection" — @Field("hall_selection")
                const hall    = event.hallSelection || '';
                // Event entity uses "peopleCount"  — @Field("people_count")
                const people  = event.peopleCount   ?? '';
                // MongoDB _id exposed as "id"
                const eventId = event.id            || '';

                setFormData(prev => ({
                    ...prev,
                    hallName:    hall,
                    peopleCount: people,
                    eventId:     eventId,
                }));
                setEventFound(true);
                toast.success(`Event found: ${hall} · ${people} people`);
            } else {
                toast.error('No events found for this date');
            }
        } catch (error) {
            console.error('Event Service error:', error);
            toast.error('Could not reach Event Service');
        } finally {
            setEventLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const payload = {
                ...formData,
                quantity:     parseInt(formData.quantity),
                unitPrice:    parseFloat(formData.unitPrice),
                reorderLevel: parseInt(formData.reorderLevel),
                peopleCount:  formData.peopleCount ? parseInt(formData.peopleCount) : null,
            };
            await axios.post(API_URL, payload);
            toast.success('Item added to inventory!');
            navigate('/inventory');
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || 'Failed to add item.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 p-4 md:p-8">
            <div className="max-w-3xl mx-auto">

                <div className="flex items-center gap-4 mb-8">
                    <button onClick={() => navigate(-1)}
                        className="p-2 bg-white shadow-sm hover:bg-slate-100 rounded-lg transition-colors border border-slate-200">
                        <ArrowLeft className="w-6 h-6 text-slate-700" />
                    </button>
                    <h1 className="text-3xl font-bold text-slate-800">Add New Item</h1>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-8">
                    <form onSubmit={handleSubmit} className="space-y-6">

                        {/* ── Event Section ── */}
                        <div className={`p-6 rounded-xl border transition-all ${eventFound ? 'bg-green-50 border-green-200' : 'bg-blue-50 border-blue-100'}`}>
                            <h3 className="font-bold mb-4 flex items-center gap-2 text-sm uppercase tracking-wider text-slate-700">
                                <Calendar className="w-4 h-4" /> Link to Event
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-2">Select Date</label>
                                    <input
                                        type="date"
                                        name="bookingDate"
                                        value={formData.bookingDate}
                                        onChange={handleDateChange}
                                        className="w-full p-2.5 bg-white border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                                    />
                                    {eventLoading && <p className="text-xs text-blue-500 mt-1 animate-pulse">Fetching event...</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                                        Hall Name {eventFound && <span className="text-green-600 text-xs font-bold ml-1">✓ Auto-filled</span>}
                                    </label>
                                    <div className="relative">
                                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                        <input
                                            type="text"
                                            value={formData.hallName}
                                            readOnly
                                            placeholder="Auto-filled from event"
                                            className={`w-full pl-9 p-2.5 border rounded-lg text-sm outline-none ${
                                                eventFound ? 'bg-green-50 border-green-300 text-green-900 font-semibold' : 'bg-slate-50 border-blue-100 text-slate-500'
                                            }`}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                                        Expected People {eventFound && <span className="text-green-600 text-xs font-bold ml-1">✓ Auto-filled</span>}
                                    </label>
                                    <div className="relative">
                                        <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                        <input
                                            type="number"
                                            value={formData.peopleCount}
                                            readOnly
                                            placeholder="0"
                                            className={`w-full pl-9 p-2.5 border rounded-lg text-sm outline-none ${
                                                eventFound ? 'bg-green-50 border-green-300 text-green-900 font-semibold' : 'bg-slate-50 border-blue-100 text-slate-500'
                                            }`}
                                        />
                                    </div>
                                </div>
                            </div>

                            {eventFound && formData.eventId && (
                                <p className="text-xs text-green-700 mt-3 bg-green-100 px-3 py-1.5 rounded-lg inline-block">
                                    🔗 Event ID: <strong>{formData.eventId}</strong>
                                </p>
                            )}
                        </div>

                        {/* ── Item Details ── */}
                        <div className="grid md:grid-cols-2 gap-6">

                            <div className="col-span-2 md:col-span-1">
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Item Name *</label>
                                <div className="relative">
                                    <Package className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                    <input required type="text" name="itemName" value={formData.itemName} onChange={handleChange}
                                        className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                        placeholder="e.g. Folding Chair" />
                                </div>
                            </div>

                            <div className="col-span-2 md:col-span-1">
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Category *</label>
                                <div className="relative">
                                    <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                    <select required name="category" value={formData.category} onChange={handleChange}
                                        className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none appearance-none">
                                        <option value="EVENT_SUPPLY">Event Supply</option>
                                        <option value="FURNITURE">Furniture</option>
                                        <option value="ELECTRONICS">Electronics</option>
                                        <option value="CONSUMABLES">Consumables</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Initial Quantity *</label>
                                <div className="relative">
                                    <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                    <input required type="number" min="0" name="quantity" value={formData.quantity} onChange={handleChange}
                                        className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="0" />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Unit Price (LKR) *</label>
                                <div className="relative">

                                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-xs">LKR
                                    </div>
                                    
                                    <input required type="number" step="0.01" min="0.01" name="unitPrice" value={formData.unitPrice} onChange={handleChange}
                                        className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="0.00" />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Reorder Alert Level *</label>
                                <div className="relative">
                                    <AlertCircle className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                    <input required type="number" min="1" name="reorderLevel" value={formData.reorderLevel} onChange={handleChange}
                                        className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="e.g. 20" />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Storage Location</label>
                                <div className="relative">
                                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                    <input type="text" name="storageLocation" value={formData.storageLocation} onChange={handleChange}
                                        className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="e.g. Aisle 4, Shelf B" />
                                </div>
                            </div>

                            <div className="col-span-2">
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Supplier Name</label>
                                <div className="relative">
                                    <Truck className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                    <input type="text" name="supplier" value={formData.supplier} onChange={handleChange}
                                        className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Supplier Company Ltd." />
                                </div>
                            </div>
                        </div>

                        <button type="submit" disabled={loading}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-xl font-bold shadow-lg transition-all flex justify-center items-center gap-2 mt-8 disabled:opacity-70">
                            {loading ? 'Saving...' : <><Save className="w-5 h-5" /> Save Inventory Item</>}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}