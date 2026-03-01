import axios from "axios";

const API_BASE = import.meta.env.VITE_BACKEND_URL_PAYMENT || "http://localhost:8082/api/payments";

export const createPaymentIntent = (payload) => {
  return axios.post(`${API_BASE}/create`, payload);
};