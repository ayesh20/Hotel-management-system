import axios from "axios";

const BASE_URL = "http://localhost:8080/customers";

export const getCustomers = () => axios.get(BASE_URL);

export const addCustomer = (data) => axios.post(BASE_URL, data);

export const getCustomerById = (id) =>
  axios.get(`${BASE_URL}/${id}`);

export const updateCustomer = (id, data) =>
  axios.put(`${BASE_URL}/${id}`, data);

export const deleteCustomer = (id) =>
  axios.delete(`${BASE_URL}/${id}`);