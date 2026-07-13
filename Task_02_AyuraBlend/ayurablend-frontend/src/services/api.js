import axios from 'axios';

const api = axios.create({
  // Force a clean structure so it doesn't glue strings together awkwardly
  baseURL: import.meta.env.VITE_API_URL 
    ? `${import.meta.env.VITE_API_URL.replace(/\/$/, '')}/` 
    : (import.meta.env.PROD 
        ? 'https://future-fs-01-w6dl.onrender.com/api/' 
        : 'http://localhost:5001/api/'),
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
