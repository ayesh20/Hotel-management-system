import React, { useState } from 'react';
import { Home, DollarSign, Save, X, ArrowLeft, Hash } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Dashboard() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [roomNumber, setRoomNumber] = useState('');
    const [roomType, setRoomType] = useState('Single');
    const [pricePerNight, setPricePerNight] = useState('');
    const [error, setError] = useState('');         

    const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

    const handleAddRoom = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);   


    }
    return (        <div className="min-h-screen bg-gray-100 p-6">
            <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow">
                <div className="flex items-center mb-6">
                    <Home className="w-8 h-8 text-blue-500 mr-2" />
                    <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
                </div>
                <p className="text-gray-600">Welcome to the admin dashboard. Use the navigation menu to manage rooms and bookings.</p>
            </div>
        </div>
    );
}