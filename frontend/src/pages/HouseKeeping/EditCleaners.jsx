import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";

function EditCleaners() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    roomNumber: "",
    staffId: "",
    cleaningDate: "",
    status: "PENDING",
    remarks: "",
  });
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cleaners, setCleaners] = useState([]);

  const API_HOUSEKEEPING = import.meta.env.VITE_BACKEND_URL_HOUSEKEPING;
  // const API_ROOMS = import.meta.env.VITE_BACKEND_URL;
  const API_STAFF = import.meta.env.VITE_BACKEND_URL_STAFF;

  // Fetch cleaner data
  useEffect(() => {
    const fetchCleaner = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await axios.get(
          `${API_HOUSEKEEPING}/housekeeping/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        setFormData(response.data);
      } catch (error) {
        toast.error("Failed to fetch cleaner data");
      } finally {
        setLoading(false);
      }
    };

    fetchCleaner();
  }, [id]);
  useEffect(() => {
    const fetchCleaners = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          toast.error("Please login first");
          navigate("/");
          return;
        }

        const response = await axios.get(API_STAFF, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        console.log("STAFF RESPONSE:", response.data);

        // If your API returns { data: [...] }
        const staffList = Array.isArray(response.data.data)
          ? response.data.data
          : [];

        const onlyCleaners = staffList.filter(
          (staff) => staff.role && staff.role.toLowerCase().includes("clean"),
        );

        setCleaners(onlyCleaners);
      } catch (error) {
        console.error("Fetch staff error:", error);

        if (error.response?.status === 403) {
          toast.error("Unauthorized. Please login again.");
          navigate("/");
        } else {
          toast.error("Failed to fetch cleaners");
        }
      }
    };

    fetchCleaners();
  }, []);

  // Fetch available rooms for dropdown
  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await axios.get(
          `${API_HOUSEKEEPING}/housekeeping/roomNumbers`,
        ); // adjust endpoint if needed
        setRooms(response.data); // assume response.data is array of rooms [{roomNumber: "101"}, ...]
      } catch (error) {
        toast.error("Failed to fetch room numbers");
      }
    };
    fetchRooms();
  }, []);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Submit updates
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${API_HOUSEKEEPING}/housekeeping/${id}`, formData);
      toast.success("Cleaner updated successfully!");
      navigate("/allCleaners");
    } catch (error) {
      toast.error("Failed to update cleaner");
    }
  };

  if (loading) {
    return <div className="text-center py-12">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-slate-100 p-4 md:p-8">
      <div className="max-w-3xl mx-auto bg-white p-8 rounded-2xl shadow-lg">
        <h1 className="text-2xl font-bold mb-6">Edit Cleaner</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Room Dropdown */}
          <div>
            <label className="block mb-1 font-semibold">Room Number</label>
            <select
              name="roomNumber"
              value={formData.roomNumber}
              onChange={handleChange}
              className="w-full border p-2 rounded-lg"
              required
            >
              <option value="" disabled>
                Select a room
              </option>
              {rooms.map((room) => (
                <option key={room.roomNumber} value={room.roomNumber}>
                  {room.roomNumber}
                </option>
              ))}
            </select>
          </div>

          {/* Cleaner ID */}
          <div>
            <label className="block mb-1 font-semibold">Cleaner</label>
            <select
              name="staffId"
              value={formData.staffId}
              onChange={handleChange}
              className="w-full border p-2 rounded-lg"
              required
            >
              {cleaners.map((cleaner) => (
                <option key={cleaner.id} value={cleaner.id}>
                  {cleaner.id} - {cleaner.name}
                </option>
              ))}
            </select>
          </div>
          {/* Cleaning Date */}
          <div>
            <label className="block mb-1 font-semibold">Cleaning Date</label>
            <input
              type="date"
              name="cleaningDate"
              value={formData.cleaningDate}
              onChange={handleChange}
              className="w-full border p-2 rounded-lg"
              required
            />
          </div>

          {/* Status */}
          <div>
            <label className="block mb-1 font-semibold">Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full border p-2 rounded-lg"
            >
              <option value="PENDING">PENDING</option>
              <option value="COMPLETED">COMPLETED</option>
              <option value="CANCELLED">CANCELLED</option>
            </select>
          </div>

          {/* Remarks */}
          <div>
            <label className="block mb-1 font-semibold">Remarks</label>
            <textarea
              name="remarks"
              value={formData.remarks}
              onChange={handleChange}
              className="w-full border p-2 rounded-lg"
              rows={3}
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-4 mt-6">
            <button
              type="submit"
              className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition"
            >
              Save Changes
            </button>
            <button
              type="button"
              onClick={() => navigate("/allCleaners")}
              className="bg-gray-300 px-6 py-2 rounded-lg hover:bg-gray-400 transition"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditCleaners;
