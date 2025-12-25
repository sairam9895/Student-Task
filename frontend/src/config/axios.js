import axios from 'axios';

// Get API base URL from environment variable
// In development, Vite proxy handles /api routes
// In production (Vercel), use the full backend URL
const API_BASE_URL = import.meta.env.VITE_API_URL || '';

// Create axios instance with base URL
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;

