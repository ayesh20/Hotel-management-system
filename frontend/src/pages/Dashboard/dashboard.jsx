import React, { useState, useEffect } from 'react';
import { Home, Save, X, ArrowLeft, Hash,User, LogOut, Users, DollarSign, Calendar, TrendingUp } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Dashboard() {
    const navigate = useNavigate();
    const [currentDate, setCurrentDate] = useState('');
    const [greeting, setGreeting] = useState('Good Morning');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(''); 
   
        
    const [dashboardData, setDashboardData] = useState({
            totalRooms: 0,
            
        });
    
    const API_URL = import.meta.env.VITE_BACKEND_URL;

    useEffect(() => {
            // Set current date and time
            const updateDateTime = () => {
                const now = new Date();
                const options = { 
                    day: 'numeric', 
                    month: 'long', 
                    year: 'numeric',
                    weekday: 'long'
                };
                const formattedDate = now.toLocaleDateString('en-US', options);
                const time = now.toLocaleTimeString('en-US', { 
                    hour: '2-digit', 
                    minute: '2-digit',
                    hour12: true 
                });
                setCurrentDate(`${formattedDate} - ${time}`);
    
                // Set greeting based on time
                const hour = now.getHours();
                if (hour < 12) setGreeting('Good Morning');
                else if (hour < 18) setGreeting('Good Afternoon');
                else setGreeting('Good Evening');
            };
    
            updateDateTime();
            const interval = setInterval(updateDateTime, 1000);
            return () => clearInterval(interval);
        }, []);
       
        useEffect(() => {
                fetchDashboardData();
            }, []);
        
            const fetchDashboardData = async () => {
                try {
                    setLoading(true);
        
                    // Fetch all required data in parallel
                    const [Roomrs, ] = await Promise.all([
                        axios.get(`${API_URL}/rooms/all`, {
                            
                        }),
                        
                    ]);
        
                    // Process students data
                     const rooms = Roomrs.data || [];
                    const totalRooms = rooms.length;
        
                    setDashboardData(prev => ({
                        ...prev,
                        totalRooms
                    }));
        
        
                } catch (error) {
                    console.error('Fetch dashboard data error:', error);
                    if (error.response?.status === 403) {
                        toast.error('Session expired. Please login again');
                        setTimeout(() => navigate('/'), 2000);
                    }
                } finally {
                    setLoading(false);
                }
            };
    
    const handleLogout = () => {
            if (window.confirm('Are you sure you want to log out?')) {
                localStorage.removeItem('authToken');
                localStorage.removeItem('adminData');
                toast.success('Logged out successfully');
                navigate('/');
            }
        };

     if (loading) {
        return (
            <div className="min-h-screen bg-slate-100 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-slate-600">Loading dashboard...</p>
                </div>
            </div>
        );
    }

    return (
            <div className="min-h-screen bg-slate-100 p-4 md:p-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                    <h1 className="text-2xl md:text-3xl font-bold text-slate-800">
                        Welcome To Your Dashboard
                    </h1>
                    
                    <div className="flex items-center gap-4">
                        <span className="text-sm md:text-base text-slate-600">
                            {currentDate}
                        </span>
                        <button className="p-2 hover:bg-slate-200 rounded-full transition-colors">
                            <User className="w-6 h-6 text-slate-700" />
                        </button>
                        <button 
                            onClick={handleLogout}
                            className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg font-semibold transition-colors shadow-md flex items-center gap-2"
                        >
                            <LogOut className="w-4 h-4" />
                            Log out
                        </button>
                    </div>
                </div>
    
                {/* Hero Banner */}
                <div className="bg-linear-to-r from-blue-800 to-blue-900 rounded-2xl p-8 h-60 md:p-12 mb-8 relative overflow-hidden shadow-xl">
                    <div className="relative z-10">
                        <h2 className="text-4xl md:text-5xl font-bold text-white mb-2">
                            {greeting}
                        </h2>
                        <p className="text-blue-100 text-lg">
                            Here's what's happening today
                        </p>
                    </div>
                    
                    <div className="absolute right-8 bottom-0 w-64 h-64 opacity-90">
                        <img 
                            src="/images/design.png" 
                            alt="Dashboard illustration"
                            className="w-full h-full object-contain"
                            onError={(e) => {
                                e.target.style.display = 'none';
                            }}
                        />
                    </div>
                </div>
    
                {/* Analysis Section */}
                <div className="mb-8">
                    <h2 className="text-2xl font-bold text-slate-800 mb-4">Analytics Overview</h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        
                        <div className="bg-linear-to-br from-green-400 to-green-600 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow cursor-pointer">
                            <div className="flex items-center justify-between mb-3">
                                <Home className="w-12 h-12 text-white opacity-80" />
                                <TrendingUp className="w-6 h-6 text-white" />
                            </div>
                            <div className="text-white">
                                <h3 className="text-lg font-semibold mb-1 opacity-90">Total Rooms</h3>
                                <p className="text-4xl font-bold">{dashboardData.totalRooms}</p>
                                <p className="text-sm mt-2 opacity-80">See all rooms</p>
                            </div>
                        </div>
    
                       
                        <div className="bg-linear-to-br from-yellow-400 to-yellow-600 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow cursor-pointer">
                            <div className="flex items-center justify-between mb-3">
                                <DollarSign className="w-12 h-12 text-white opacity-80" />
                            </div>
                            <div className="text-white">
                                <h3 className="text-lg font-semibold mb-1 opacity-90">Payments</h3>
                                <p className="text-4xl font-bold"></p>
                                <p className="text-sm mt-2 opacity-80">Revenue</p>
                            </div>
                        </div>
    
                       
                        <div className="bg-linear-to-br from-blue-400 to-blue-600 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow cursor-pointer">
                            <div className="flex items-center justify-between mb-3">
                                    
                                <Users className="w-12 h-12 text-white opacity-80" />
                            </div>
                            <div className="text-white">
                                <h3 className="text-lg font-semibold mb-1 opacity-90">Total Guests</h3>
                                <p className="text-4xl font-bold"></p>
                                <p className="text-sm mt-2 opacity-80">Registered users</p>
                            </div>
                        </div>
    
                       
                        <div className="bg-linear-to-br from-red-400 to-red-600 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow cursor-pointer">
                            <div className="flex items-center justify-between mb-3">
                                <Calendar className="w-12 h-12 text-white opacity-80" />
                            </div>
                            <div className="text-white">
                                <h3 className="text-lg font-semibold mb-1 opacity-90">Today's</h3>
                                <p className="text-4xl font-bold"> ab</p>
                                
                            </div>
                        </div>
                    </div>
                </div>
    
               
    
              
                <div>
                    <h2 className="text-2xl font-bold text-slate-800 mb-4">Hotel Management</h2>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        <button 
                            className="bg-slate-300 hover:bg-slate-400 text-slate-800 text-xl font-bold py-8 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg hover:scale-105" 
                            onClick={() => navigate('')}
                        >
                            
                            Staff
                        </button>
    
                        <button 
                            className="bg-slate-300 hover:bg-slate-400 text-slate-800 text-xl font-bold py-8 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg hover:scale-105" 
                            onClick={() => navigate('/payment-management')}
                        >
                            
                            Guests
                        </button>
    
                        <button 
                            className="bg-slate-300 hover:bg-slate-400 text-slate-800 text-xl font-bold py-8 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg hover:scale-105" 
                            onClick={() => navigate('/allrooms')}
                        >
                           
                            Rooms
                        </button>
    
                        <button 
                            className="bg-slate-300 hover:bg-slate-400 text-slate-800 text-xl font-bold py-8 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg hover:scale-105" 
                            onClick={() => navigate('/allrooms')}
                        >
                            
                           Transport
                        </button>

                         <button 
                            className="bg-slate-300 hover:bg-slate-400 text-slate-800 text-xl font-bold py-8 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg hover:scale-105" 
                            onClick={() => navigate('/allReservation')}
                        >
                            
                           Booking
                        </button>

                         <button 
                            className="bg-slate-300 hover:bg-slate-400 text-slate-800 text-xl font-bold py-8 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg hover:scale-105" 
                            onClick={() => navigate('/allrooms')}
                        >
                            
                           Feedback & Reviews
                        </button>

                        <button 
                            className="bg-slate-300 hover:bg-slate-400 text-slate-800 text-xl font-bold py-8 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg hover:scale-105" 
                            onClick={() => navigate('/allCleaners')}
                        >
                            Housekeeping
                        </button>

                        <button 
                            className="bg-slate-300 hover:bg-slate-400 text-slate-800 text-xl font-bold py-8 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg hover:scale-105" 
                            onClick={() => navigate('/allrooms')}
                        >
                            Inventry Management
                        </button>
                        <button 
                            className="bg-slate-300 hover:bg-slate-400 text-slate-800 text-xl font-bold py-8 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg hover:scale-105" 
                            onClick={() => navigate('/allrooms')}
                        >
                            Special Event
                        </button>
                    </div>
                </div>
            </div>
        );return (        <div className="min-h-screen bg-gray-100 p-6">
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