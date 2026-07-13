import React, { useState, useContext } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { login } from '../services/authService';
import { AuthContext } from '../context/AuthContext';
import logoImg from '../assets/ayur_blend_logo.png';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();
  const { loginContext } = useContext(AuthContext);

  const infoMessage = location.state?.message || '';

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }

    setLoading(true);
    try {
      const data = await login(email, password);
      loginContext(data.user, data.token);
      
      if (data.user && data.user.role === 'admin') {
        navigate('/admin');
      } else {
        const from = location.state?.from?.pathname || '/';
        navigate(from, { replace: true });
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password.');
      setLoading(false);
    }
  };

  return (
    <div className="py-24 px-8 max-w-md mx-auto">
      <div className="bg-surface p-8 rounded-xl shadow-sm border border-gray-100">
        
        <div className="mb-6 flex justify-start">
          <Link to="/" className="text-sm text-primary font-medium hover:underline">
            ← Back to Home
          </Link>
        </div>

        {/* Brand Header */}
        <div className="flex flex-col items-center mb-6">
          <img src={logoImg} alt="AyuraBlend Logo" className="h-16 w-16 object-contain rounded-full mb-3 shadow-xs" />
          <h1 className="text-3xl font-serif text-primary text-center">Welcome Back</h1>
        </div>
        
        {error && (
          <div className="bg-red-50 text-red-600 border border-red-200 p-3 rounded-md mb-6 text-sm text-center font-medium">
            {error}
          </div>
        )}

        {infoMessage && !error && (
          <div className="bg-blue-50 text-blue-700 border border-blue-200 p-3 rounded-md mb-6 text-sm text-center font-medium">
            {infoMessage}
          </div>
        )}

        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <div>
            <label className="block text-text-light mb-2 text-sm font-medium">Email Address</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-primary bg-bg"
              placeholder="hello@ayurablend.com"
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-text-light mb-2 text-sm font-medium">Password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-primary bg-bg"
              placeholder="••••••••"
              disabled={loading}
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className={`w-full text-white px-8 py-3 rounded-md transition-all text-center font-medium mt-2 flex items-center justify-center gap-2 ${loading ? 'bg-primary/60 cursor-not-allowed scale-[0.98]' : 'bg-primary hover:bg-primary-dim shadow-sm cursor-pointer border-0'}`}
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        <p className="text-center text-text-light mt-6 text-sm">
          New to AyuraBlend? <Link to="/register" className="text-primary font-medium hover:underline">Create an account</Link>
        </p>
      </div>
    </div>
  );
}
