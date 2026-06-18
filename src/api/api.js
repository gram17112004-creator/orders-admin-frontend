import axios from "axios";
import { API_BASE_URL } from "../constants/appConstants";

export const ordersUrl = `${API_BASE_URL}/orders`;
export const productsUrl = `${API_BASE_URL}/products`;
export const customersUrl = `${API_BASE_URL}/customers`;
export const statsUrl = `${API_BASE_URL}/orders/stats/summary`;

export async function getAllData() {
  return Promise.allSettled([
    axios.get(ordersUrl),
    axios.get(productsUrl),
    axios.get(customersUrl),
    axios.get(statsUrl),
  ]);
}

export function extractArray(data) {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.data)) return data.data;
  if (Array.isArray(data?.orders)) return data.orders;
  if (Array.isArray(data?.products)) return data.products;
  if (Array.isArray(data?.customers)) return data.customers;
  return [];
}