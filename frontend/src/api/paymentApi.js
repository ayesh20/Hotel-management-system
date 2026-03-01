import axios from "axios";

const API_BASE = import.meta.env.VITE_BACKEND_URL_PAYMENT || "http://localhost:8082/api/payments";

// Create a Stripe PaymentIntent (returns clientSecret)
export const createStripeIntent = (payload) => {
  return axios.post(`${API_BASE}/create-intent`, payload);
};

// Save a CARD payment record after Stripe confirms
export const createCardPayment = (payload) => {
  return axios.post(`${API_BASE}/create`, payload);
};

// Create a CASH payment (pending)
export const createCashPayment = (payload) => {
  return axios.post(`${API_BASE}`, payload);
};

// Get all payments
export const getAllPayments = () => {
  return axios.get(`${API_BASE}`);
};