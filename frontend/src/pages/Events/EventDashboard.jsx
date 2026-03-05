import React, { useState, useEffect } from 'react';
import { ArrowLeft, Edit2, Trash2, CalendarDays, Users, CreditCard, XCircle, LayoutDashboard } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function EventDashboard() {
  const [dashboard, setDashboard] = useState(null);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const API_URL = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    fetchDashboardData();
    fetchEvents();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Matches Spring Boot @GetMapping("/dashboard")
      const response = await axios.get(`${API_URL}/api/events/dashboard`);
      setDashboard(response.data);
    } catch (error) {
      console.error('Fetch dashboard error:', error);
      toast.error('Failed to fetch dashboard data');
    }
  };

  const fetchEvents = async () => {
    try {
      setLoading(true);
      // Matches Spring Boot @GetMapping("/all")
      const response = await axios.get(`${API_URL}/api/events/all`);
      setEvents(response.data);
    } catch (error) {
      console.error('Fetch events error:', error);
      toast.error('Failed to fetch events');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (eventId) => {
    if (!window.confirm('Are you sure you want to delete this event?')) return;
    try {
      // Matches Spring Boot @DeleteMapping("/{id}")
      await axios.delete(`${API_URL}/api/events/${eventId}`);
      toast.success('Event deleted successfully');
      fetchEvents();
      fetchDashboardData(); // Refresh summary cards too
    } catch (error) {
      console.error('Delete event error:', error);
      toast.error('Failed to delete event');
    }
  };

  const handleEdit = (eventId) => navigate(`/editevent/${eventId}`);
  const handleBack = () => navigate('/dashboard');

  const getPaymentBadge = (status) => {
    const styles = {
      PAID: 'bg-green-100 text-green-700',
      PENDING: 'bg-yellow-100 text-yellow-700',
      CANCELLED: 'bg-red-100 text-red-700',
    };
    return styles[status?.toUpperCase()] || 'bg-slate-100 text-slate-600';
  };

  const getStatusBadge = (status) => {
    const styles = {
      CONFIRMED: 'bg-blue-100 text-blue-700',
      CANCELLED: 'bg-red-100 text-red-700',
      COMPLETED: 'bg-slate-100 text-slate-600',
    };
    return styles[status?.toUpperCase()] || 'bg-slate-100 text-slate-600';
  };

  const summaryCards = [
    {
      label: 'Total Events',
      value: dashboard?.totalEvents ?? '-',
      icon: <CalendarDays className="w-6 h-6 text-blue-600" />,
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      text: 'text-blue-700',
    },
    {
      label: 'Paid Events',
      value: dashboard?.paidEvents ?? '-',
      icon: <CreditCard className="w-6 h-6 text-green-600" />,
      bg: 'bg-green-50',
      border: 'border-green-200',
      text: 'text-green-700',
    },
    {
      label: 'Pending Payments',
      value: dashboard?.pendingPayments ?? '-',
      icon: <Users className="w-6 h-6 text-yellow-600" />,
      bg: 'bg-yellow-50',
      border: 'border-yellow-200',
      text: 'text-yellow-700',
    },
    {
      label: 'Cancelled Events',
      value: dashboard?.cancelledEvents ?? '-',
      icon: <XCircle className="w-6 h-6 text-red-600" />,
      bg: 'bg-red-50',
      border: 'border-red-200',
      text: 'text-red-700',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-100 p-4 md:p-8">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={handleBack}
          className="p-2 hover:bg-slate-200 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-6 h-6 text-slate-900" />
        </button>
        <div className="flex items-center gap-2">
          <LayoutDashboard className="w-6 h-6 text-slate-700" />
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900">Events Dashboard</h1>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {summaryCards.map((card, index) => (
          <div
            key={index}
            className={`${card.bg} border ${card.border} rounded-2xl p-5 shadow-sm flex flex-col gap-3`}
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-slate-600">{card.label}</span>
              {card.icon}
            </div>
            <span className={`text-3xl font-bold ${card.text}`}>{card.value}</span>
          </div>
        ))}
      </div>

      {/* Bookings Per Hall */}
      {dashboard?.bookingsPerHall && Object.keys(dashboard.bookingsPerHall).length > 0 && (
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <h2 className="text-lg font-bold text-slate-800 mb-4">Bookings Per Hall</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(dashboard.bookingsPerHall).map(([hall, count]) => (
              <div key={hall} className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col gap-1">
                <span className="text-sm text-slate-500 font-medium">{hall}</span>
                <span className="text-2xl font-bold text-slate-800">{count}</span>
                <span className="text-xs text-slate-400">bookings</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Events Table */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-200">
          <h2 className="text-lg font-bold text-slate-800">All Bookings</h2>
        </div>
        <div className="p-6">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-slate-200">
                  <th className="text-left py-4 px-4 text-slate-700 font-semibold">Customer Name</th>
                  <th className="text-left py-4 px-4 text-slate-700 font-semibold">Customer ID</th>
                  <th className="text-left py-4 px-4 text-slate-700 font-semibold">Hall</th>
                  <th className="text-left py-4 px-4 text-slate-700 font-semibold">Date</th>
                  <th className="text-left py-4 px-4 text-slate-700 font-semibold">Time</th>
                  <th className="text-left py-4 px-4 text-slate-700 font-semibold">People</th>
                  <th className="text-left py-4 px-4 text-slate-700 font-semibold">Payment</th>
                  <th className="text-left py-4 px-4 text-slate-700 font-semibold">Status</th>
                  <th className="text-right py-4 px-4 text-slate-700 font-semibold">Action</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="9" className="text-center py-12">
                      <div className="flex justify-center items-center">
                        <svg className="animate-spin h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                      </div>
                    </td>
                  </tr>
                ) : events.length === 0 ? (
                  <tr>
                    <td colSpan="9" className="text-center py-12 text-slate-500">
                      No events found.
                    </td>
                  </tr>
                ) : (
                  events.map((event) => (
                    <tr
                      key={event.id}
                      className="border-b border-slate-100 hover:bg-slate-50 transition-colors"
                    >
                      <td className="py-4 px-4 text-slate-800 font-medium">{event.customerName}</td>
                      <td className="py-4 px-4 text-slate-600 text-sm">{event.customerId}</td>
                      <td className="py-4 px-4 text-slate-800">{event.hallSelection}</td>
                      <td className="py-4 px-4 text-slate-800">{event.bookingDate}</td>
                      <td className="py-4 px-4 text-slate-800">{event.eventTime}</td>
                      <td className="py-4 px-4 text-slate-800">{event.peopleCount}</td>
                      <td className="py-4 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getPaymentBadge(event.paymentStatus)}`}>
                          {event.paymentStatus}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusBadge(event.eventStatus)}`}>
                          {event.eventStatus}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleEdit(event.id)}
                            className="p-2 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Edit Event"
                          >
                            <Edit2 className="w-5 h-5 text-slate-600" />
                          </button>
                          <button
                            onClick={() => handleDelete(event.id)}
                            className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete Event"
                          >
                            <Trash2 className="w-5 h-5 text-slate-600" />
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
