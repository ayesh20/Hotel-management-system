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
}