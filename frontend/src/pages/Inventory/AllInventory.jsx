

import React, { useState, useEffect } from 'react';
import { Package, Plus, Edit2, Trash2, AlertTriangle, PlusCircle, Search,  Banknote } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function AllInventory() {
    const [items, setItems] = useState([]);
    const [totalValue, setTotalValue] = useState(0);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();

    const API_URL = import.meta.env.VITE_BACKEND_URL_Inventory;

    useEffect(() => {
        fetchInventory();
        fetchTotalValue();
    }, []);

    const fetchInventory = async () => {
        try {
            setLoading(true);
            const response = await axios.get(API_URL);
            setItems(response.data);
        } catch (error) {
            toast.error('Failed to fetch inventory');
        } finally {
            setLoading(false);
        }
    };

    const fetchTotalValue = async () => {
        try {
            const response = await axios.get(`${API_URL}/total-value`);
            setTotalValue(response.data);
        } catch (error) {
            console.error('Failed to fetch total value');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this item?')) return;
        try {
            await axios.delete(`${API_URL}/${id}`);
            toast.success('Item deleted successfully');
            fetchInventory();
            fetchTotalValue();
        } catch (error) {
            toast.error('Failed to delete item');
        }
    };

    const handleRestock = async (id) => {
        const amount = window.prompt('Enter quantity to restock:');
        if (!amount || isNaN(amount) || amount <= 0) return;
        try {
            await axios.patch(`${API_URL}/${id}/restock?amount=${amount}`);
            toast.success('Restocked successfully!');
            fetchInventory();
            fetchTotalValue();
        } catch (error) {
            toast.error('Failed to restock item');
        }
    };

    const handleSearch = async () => {
        if (!searchTerm.trim()) {
            fetchInventory();
            return;
        }
        try {
            const response = await axios.get(`${API_URL}/search?name=${searchTerm}`);
            setItems(response.data);
        } catch (error) {
            toast.error('Search failed');
        }
    };

    const getStatusBadge = (status) => {
        if (status === 'OUT_OF_STOCK') return 'bg-red-100 text-red-700';
        if (status === 'LOW_STOCK')    return 'bg-yellow-100 text-yellow-700';
        return 'bg-green-100 text-green-700';
    };

    return (
        <div className="min-h-screen bg-slate-50 p-4 md:p-8">
            <div className="max-w-7xl mx-auto space-y-6">

                {/* Header & Stats */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-800 flex items-center gap-3">
                            <Package className="w-8 h-8 text-blue-600" />
                            Inventory Management
                        </h1>
                        <p className="text-slate-500 mt-1">Manage warehouse stock, suppliers, and pricing</p>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex items-center gap-3">
                            <div className="p-2 bg-green-100 rounded-lg">
                                <Banknote className="w-6 h-6 text-green-600" />
                            </div>
                            <div>
                                <p className="text-sm text-slate-500 font-semibold">Total Value</p>
                                <p className="text-xl font-bold text-slate-800">LKR {totalValue.toFixed(2)}</p>
                            </div>
                        </div>
                        <button onClick={() => navigate('/add-inventory')}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-4 rounded-xl font-semibold transition-all shadow-md hover:shadow-lg flex items-center gap-2">
                            <Plus className="w-5 h-5" /> Add New Item
                        </button>
                    </div>
                </div>

                {/* Search Bar */}
                <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Search items by name..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                            className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                        />
                    </div>
                    <button onClick={handleSearch}
                        className="bg-slate-800 text-white px-6 py-3 rounded-lg hover:bg-slate-700 transition-colors">
                        Search
                    </button>
                    <button onClick={() => { setSearchTerm(''); fetchInventory(); }}
                        className="bg-slate-200 text-slate-700 px-6 py-3 rounded-lg hover:bg-slate-300 transition-colors">
                        Clear
                    </button>
                </div>

                {/* Table */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-slate-50 border-b border-slate-200">
                                <tr>
                                    <th className="p-4 font-semibold text-slate-600">Event Date</th>
                                    <th className="p-4 font-semibold text-slate-600">Hall</th>
                                    <th className="p-4 font-semibold text-slate-600">People</th>
                                    <th className="p-4 font-semibold text-slate-600">Item Name</th>
                                    <th className="p-4 font-semibold text-slate-600">Category</th>
                                    <th className="p-4 font-semibold text-slate-600">Qty</th>
                                    <th className="p-4 font-semibold text-slate-600">Price</th>
                                    <th className="p-4 font-semibold text-slate-600">Location</th>
                                    <th className="p-4 font-semibold text-slate-600">Status</th>
                                    <th className="p-4 font-semibold text-slate-600 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {loading ? (
                                    <tr>
                                        <td colSpan="10" className="text-center py-8 text-slate-400">
                                            Loading inventory...
                                        </td>
                                    </tr>
                                ) : items.length === 0 ? (
                                    <tr>
                                        <td colSpan="10" className="text-center py-8 text-slate-500">
                                            No items found in inventory.
                                        </td>
                                    </tr>
                                ) : (
                                    items.map((item) => (
                                        <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                                            <td className="px-6 py-4 text-slate-600">{item.bookingDate || '—'}</td>
                                            {/* hallName in InventoryItem = hallSelection from Event */}
                                            <td className="px-6 py-4 text-slate-600">{item.hallName || '—'}</td>
                                            <td className="px-6 py-4 text-slate-600">{item.peopleCount || '—'}</td>
                                            <td className="p-4 font-medium text-slate-800">{item.itemName}</td>
                                            <td className="p-4 text-slate-600">
                                                <span className="bg-slate-100 px-2 py-1 rounded text-xs">{item.category}</span>
                                            </td>
                                            <td className="p-4 text-slate-800 font-semibold">{item.quantity}</td>
                                            <td className="p-4 text-slate-600">LKR {item.unitPrice.toFixed(2)}</td>
                                            <td className="p-4 text-slate-600 text-sm">{item.storageLocation || '—'}</td>
                                            <td className="p-4">
                                                <span className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 w-max ${getStatusBadge(item.status)}`}>
                                                    {(item.status === 'LOW_STOCK' || item.status === 'OUT_OF_STOCK') && <AlertTriangle className="w-3 h-3" />}
                                                    {item.status.replace(/_/g, ' ')}
                                                </span>
                                            </td>
                                            <td className="p-4">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button onClick={() => handleRestock(item.id)} title="Restock"
                                                        className="p-2 bg-green-50 text-green-600 hover:bg-green-100 rounded-lg">
                                                        <PlusCircle className="w-5 h-5" />
                                                    </button>
                                                    <button onClick={() => navigate(`/edit-inventory/${item.id}`)} title="Edit"
                                                        className="p-2 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg">
                                                        <Edit2 className="w-5 h-5" />
                                                    </button>
                                                    <button onClick={() => handleDelete(item.id)} title="Delete"
                                                        className="p-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg">
                                                        <Trash2 className="w-5 h-5" />
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