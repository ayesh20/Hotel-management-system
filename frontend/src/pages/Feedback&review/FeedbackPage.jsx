import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Trash2, Star, ChevronDown, Pencil, X, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const FeedbackPage = () => {

    const navigate = useNavigate();
    const [feedbacks, setFeedbacks] = useState([]);
    const [customers, setCustomers] = useState([]);          // ✅ Customer list from microservice
    const [customersLoading, setCustomersLoading] = useState(true); // ✅ Loading state for dropdown
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
        fullName: '',
        comment: '',
        rating: 5
    });
    const [editingId, setEditingId] = useState(null);   // ID of the card currently being edited
    const [editData, setEditData] = useState({});        // Holds the in-place edit field values

    const API_URL = import.meta.env.VITE_BACKEND_URL_FEEDBACK; 
    useEffect(() => {
        fetchFeedbacks();
        fetchCustomers(); 
    }, []);

    const fetchFeedbacks = async () => {
        try {
            const response = await axios.get(API_URL, { withCredentials: true });
            setFeedbacks(response.data);
        } catch (error) {
            console.error("Error fetching feedback:", error);
        } finally {
            setLoading(false);
        }
    };

    //  Fetch existing customers from the Customer microservice (via backend proxy)
    const fetchCustomers = async () => {
        try {
            const response = await axios.get(`${API_URL}/check-customers`, { withCredentials: true });
            setCustomers(response.data);
        } catch (error) {
            console.error("Error fetching customers:", error);
        } finally {
            setCustomersLoading(false);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        //  Validate that a customer was selected
        if (!formData.fullName) {
            alert("Please select a customer from the dropdown.");
            return;
        }

        try {
            const payload = {
                fullName: formData.fullName,
                comment: formData.comment,
                rating: Number(formData.rating)
            };
            const response = await axios.post(API_URL, payload, { withCredentials: true });
            setFeedbacks([response.data, ...feedbacks]);
            setFormData({ fullName: '', comment: '', rating: 5 });
        } catch (error) {
            console.error("Post failed:", error.response?.data || error);
            alert("Failed to post review");
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Delete this review?")) {
            try {
                await axios.delete(`${API_URL}/${id}`, { withCredentials: true });
                setFeedbacks(feedbacks.filter(item => item.id !== id));
            } catch (error) {
                console.error("Delete failed:", error);
            }
        }
    };

    // Open edit mode for a card — pre-fill with existing values
    const handleEdit = (item) => {
        setEditingId(item.id);
        setEditData({ comment: item.comment, rating: Number(item.rating) });
    };

    // Cancel edit without saving
    const handleEditCancel = () => {
        setEditingId(null);
        setEditData({});
    };

    // Save the edited feedback via PUT
    const handleEditSave = async (item) => {
        try {
            const payload = {
                fullName: item.fullName,       // fullName stays unchanged
                comment: editData.comment,
                rating: Number(editData.rating)
            };
            const response = await axios.put(`${API_URL}/${item.id}`, payload, { withCredentials: true });
            setFeedbacks(feedbacks.map(f => f.id === item.id ? response.data : f));
            setEditingId(null);
            setEditData({});
        } catch (error) {
            console.error("Update failed:", error.response?.data || error);
            alert("Failed to update review");
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 p-6">

            {/* Header */}
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-cyan-600">
                    Customer Feedback Portal
                </h1>
                <button
                    onClick={() => navigate('/dashboard')}
                    className="bg-gray-200 px-4 py-2 rounded-lg hover:bg-gray-300 transition"
                >
                    Back
                </button>
            </div>

            {/* Feedback Cards */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
                {loading ? (
                    <p>Loading...</p>
                ) : feedbacks.length === 0 ? (
                    <p className="text-gray-500">No reviews yet. Be the first!</p>
                ) : (
                    feedbacks.map((item) => (
                        <div key={item.id} className="bg-white p-6 rounded-xl shadow">

                            {/* Card header: name + action buttons */}
                            <div className="flex justify-between items-center mb-2">
                                <h3 className="font-bold text-gray-800">{item.fullName}</h3>
                                <div className="flex items-center gap-2">
                                    {/* Edit button */}
                                    <button
                                        onClick={() => editingId === item.id ? handleEditCancel() : handleEdit(item)}
                                        title={editingId === item.id ? "Cancel edit" : "Edit review"}
                                    >
                                        {editingId === item.id
                                            ? <X size={18} className="text-gray-400"/>
                                            : <Pencil size={18} className="text-blue-500"/>
                                        }
                                    </button>
                                    {/* Delete button */}
                                    <button onClick={() => handleDelete(item.id)} title="Delete review">
                                        <Trash2 size={18} className="text-red-500"/>
                                    </button>
                                </div>
                            </div>

                            {editingId === item.id ? (
                                /* ── EDIT MODE ── */
                                <div className="space-y-3 mt-2">
                                    <textarea
                                        value={editData.comment}
                                        onChange={(e) => setEditData({ ...editData, comment: e.target.value })}
                                        rows={3}
                                        className="w-full p-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                                    />
                                    {/* Inline star rating picker */}
                                    <div className="flex gap-1">
                                        {[1,2,3,4,5].map(num => (
                                            <button
                                                key={num}
                                                type="button"
                                                onClick={() => setEditData({ ...editData, rating: num })}
                                                className={`text-2xl transition-transform hover:scale-110 ${
                                                    editData.rating >= num ? "text-yellow-400" : "text-gray-300"
                                                }`}
                                            >
                                                ★
                                            </button>
                                        ))}
                                    </div>
                                    {/* Save confirm button */}
                                    <button
                                        onClick={() => handleEditSave(item)}
                                        className="flex items-center gap-1 bg-blue-500 text-white text-sm px-4 py-1.5 rounded-lg hover:bg-blue-600 transition"
                                    >
                                        <Check size={15}/> Save
                                    </button>
                                </div>
                            ) : (
                                /* ── VIEW MODE ── */
                                <>
                                    <p className="my-3 text-gray-600">"{item.comment}"</p>
                                    <p className="my-1 text-sm text-gray-400 italic">
                                        — Reviewed by: <span className="font-medium text-gray-500">{item.fullName}</span>
                                    </p>
                                    <div className="flex mt-2">
                                        {[1,2,3,4,5].map(num => (
                                            <Star
                                                key={num}
                                                size={18}
                                                fill={num <= Number(item.rating) ? "#facc15" : "none"}
                                                color={num <= Number(item.rating) ? "#facc15" : "#cbd5e1"}
                                            />
                                        ))}
                                    </div>
                                </>
                            )}

                        </div>
                    ))
                )}
            </div>

            {/* Review Form */}
            <div className="max-w-xl mx-auto bg-white p-8 rounded-xl shadow">
                <h2 className="text-2xl font-bold mb-6 text-center">
                    Share Your Experience
                </h2>

                <form onSubmit={handleSubmit} className="space-y-4">

                    {/* ✅ CHANGED: Customer dropdown instead of free-text fullName input */}
                    <div className="relative">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Select Customer
                        </label>
                        <div className="relative">
                            <select
                                name="fullName"
                                value={formData.fullName}
                                onChange={handleChange}
                                required
                                disabled={customersLoading}
                                className="w-full p-3 pr-10 border rounded-lg appearance-none bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-cyan-500 disabled:bg-gray-100 disabled:text-gray-400"
                            >
                                <option value="">
                                    {customersLoading ? "Loading customers..." : "-- Select your name --"}
                                </option>
                                {customers.map((customer) => (
                                    <option key={customer.id} value={customer.fullName}>
                                        {customer.fullName}
                                    </option>
                                ))}
                            </select>
                            {/* Dropdown chevron icon */}
                            <ChevronDown
                                size={18}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                            />
                        </div>

                        {/* ✅ Show warning if no customers loaded */}
                        {!customersLoading && customers.length === 0 && (
                            <p className="text-xs text-red-500 mt-1">
                                Could not load customers. Please try again later.
                            </p>
                        )}
                    </div>

                    {/* Comment */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Your Comment
                        </label>
                        <textarea
                            name="comment"
                            value={formData.comment}
                            onChange={handleChange}
                            placeholder="Write your experience here..."
                            required
                            rows={4}
                            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                        />
                    </div>

                    {/* Star Rating */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Rating
                        </label>
                        <div className="flex justify-center gap-3">
                            {[1,2,3,4,5].map(num => (
                                <button
                                    key={num}
                                    type="button"
                                    onClick={() => setFormData({ ...formData, rating: num })}
                                    className={`text-3xl transition-transform hover:scale-110 ${
                                        formData.rating >= num ? "text-yellow-400" : "text-gray-300"
                                    }`}
                                >
                                    ★
                                </button>
                            ))}
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-cyan-600 text-white py-3 rounded-lg hover:bg-cyan-700 transition font-semibold"
                    >
                        Post Review
                    </button>
                </form>
            </div>
        </div>
    );
};

export default FeedbackPage;