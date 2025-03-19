import axios from 'axios';
import { AuthResponse, LoginCredentials, RegisterData, InventoryItem, User, CheckoutItem } from '../types';

const API_BASE_URL = 'http://localhost:5001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for adding auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth services
export const authService = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },

  register: async (data: RegisterData): Promise<AuthResponse> => {
    const response = await api.post('/auth/register', data);
    return response.data;
  },

  getPendingApprovals: async (): Promise<User[]> => {
    const response = await api.get('/auth/pending-approvals');
    return response.data;
  },

  approveUser: async (userId: string): Promise<void> => {
    await api.post(`/auth/approve/${userId}`);
  }
};

// Inventory services
export const inventoryService = {
  getAllItems: async (): Promise<InventoryItem[]> => {
    const response = await api.get('/inventory');
    return response.data;
  },

  addItem: async (item: Omit<InventoryItem, '_id'>): Promise<InventoryItem> => {
    const response = await api.post('/inventory', item);
    return response.data;
  },

  updateItem: async (id: string, updates: Partial<InventoryItem>): Promise<InventoryItem> => {
    const response = await api.put(`/inventory/${id}`, updates);
    return response.data;
  },

  checkoutItems: async (items: CheckoutItem[]): Promise<void> => {
    await api.post('/inventory/checkout', { items });
  },

  exportInventory: async (): Promise<Blob> => {
    const response = await api.get('/inventory/export', { responseType: 'blob' });
    return response.data;
  }
};

export default api; 