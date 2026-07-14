import axios from 'axios';

// ─── DEPLOYMENT INSTRUCTIONS ──────────────────────────────
// For local development, this uses the Vite proxy → /api
// When deploying to Vercel, change this to your Render URL:
// const baseURL = 'https://your-app.onrender.com/api';
// ──────────────────────────────────────────────────────────

const api = axios.create({
  baseURL: 'https://ayurablend-backend.onrender.com/api',
  headers: { 'Content-Type': 'application/json' },
  timeout: 10000,
});

export default api;

