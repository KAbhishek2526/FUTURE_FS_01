import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.PROD 
    ? 'https://api.ayurmoringa-guntur.in/api' 
    : 'http://localhost:5001/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Automatically intercept every API request to bind active JWT tokens into headers 
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
