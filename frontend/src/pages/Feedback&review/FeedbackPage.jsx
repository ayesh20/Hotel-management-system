import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Trash2, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const FeedbackPage = () => {

    const navigate = useNavigate();
    const [feedbacks, setFeedbacks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
        fullName: '',
        comment: '',
        rating: 5
    });

    const API_URL = "http://localhost:8080/api/feedbacks";

    useEffect(() => {
        fetchFeedbacks();
    }, []);

    const fetchFeedbacks = async () => {
        try {
            const response = await axios.get(API_URL, {
                withCredentials: true   // ✅ required since backend has allowCredentials=true
            });
            setFeedbacks(response.data);
        } catch (error) {
            console.error("Error fetching feedback:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                fullName: formData.fullName,
                comment: formData.comment,
                rating: Number(formData.rating)
            };
            const response = await axios.post(API_URL, payload, {
                withCredentials: true   // ✅ required
            });
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
                await axios.delete(`${API_URL}/${id}`, {
                    withCredentials: true   // ✅ required
                });
                setFeedbacks(feedbacks.filter(item => item.id !== id));
            } catch (error) {
                console.error("Delete failed:", error);
            }
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 p-6">

            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-cyan-600">
                    Customer Feedback Portal
                </h1>
                <button
                    onClick={() => navigate('/dashboard')}
                    className="bg-gray-200 px-4 py-2 rounded-lg"
                >
                    Back
                </button>
            </div>

            {/* Feedback List */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
                {loading ? (
                    <p>Loading...</p>
                ) : feedbacks.length === 0 ? (
                    <p className="text-gray-500">No reviews yet. Be the first!</p>
                ) : (
                    feedbacks.map((item) => (
                        <div key={item.id} className="bg-white p-6 rounded-xl shadow">

                            <div className="flex justify-between items-center mb-2">
                                <h3 className="font-bold text-gray-800">{item.fullName}</h3>
                                <button onClick={() => handleDelete(item.id)}>
                                    <Trash2 size={18} className="text-red-500"/>
                                </button>
                            </div>

                            <p className="my-3 text-gray-600">"{item.comment}"</p>

                            <p className="my-1 text-sm text-gray-400 italic">
                                — Reviewed by: <span className="font-medium text-gray-500">{item.fullName}</span>
                            </p>

                            {/* ✅ Number() handles both "5" string and 5 int from backend */}
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

                        </div>
                    ))
                )}
            </div>

            {/* Form */}
            <div className="max-w-xl mx-auto bg-white p-8 rounded-xl shadow">
                <h2 className="text-2xl font-bold mb-6 text-center">
                    Share Your Experience
                </h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        placeholder="Your Full Name"
                        required
                        className="w-full p-3 border rounded-lg"
                    />
                    <textarea
                        name="comment"
                        value={formData.comment}
                        onChange={handleChange}
                        placeholder="Your Comment"
                        required
                        className="w-full p-3 border rounded-lg"
                    />

                    <div className="flex justify-center gap-3">
                        {[1,2,3,4,5].map(num => (
                            <button
                                key={num}
                                type="button"
                                onClick={() => setFormData({ ...formData, rating: num })}
                                className={`text-2xl ${formData.rating >= num ? "text-yellow-400" : "text-gray-300"}`}
                            >
                                ★
                            </button>
                        ))}
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-cyan-600 text-white py-3 rounded-lg"
                    >
                        Post Review
                    </button>
                </form>
            </div>
        </div>
    );
};

export default FeedbackPage;