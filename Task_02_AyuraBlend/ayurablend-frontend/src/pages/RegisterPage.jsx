import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { register } from '../services/authService';
import logoImg from '../assets/ayur_blend_logo.png';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!formData.name.trim() || !formData.email.trim() || !formData.password.trim()) {
      setError('Please fill in all fields.');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    setLoading(true);
    try {
      await register(formData.name, formData.email, formData.password);
      setSuccess(true);
      setLoading(false);
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create account.');
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
          <h1 className="text-3xl font-serif text-primary text-center">Create Account</h1>
        </div>
        
        {error && (
          <div className="bg-red-50 text-red-600 border border-red-200 p-3 rounded-md mb-6 text-sm text-center font-medium">
            {error}
          </div>
        )}

        {success ? (
          <div className="bg-green-50 text-green-700 border border-green-200 p-4 rounded-md text-center font-medium animate-fadeIn">
            <h3 className="font-semibold text-lg mb-2">Registration Successful!</h3>
            <p className="text-sm">Redirecting you to login...</p>
          </div>
        ) : (
          <form onSubmit={handleRegister} className="flex flex-col gap-4">
            <div>
              <label className="block text-text-light mb-2 text-sm font-medium">Full Name</label>
              <input 
                type="text" 
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-primary bg-bg"
                placeholder="John Doe"
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-text-light mb-2 text-sm font-medium">Email Address</label>
              <input 
                type="email" 
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-primary bg-bg"
                placeholder="hello@ayurablend.com"
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-text-light mb-2 text-sm font-medium">Password</label>
              <input 
                type="password" 
                name="password"
                value={formData.password}
                onChange={handleChange}
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
              {loading ? 'Registering...' : 'Register'}
            </button>
          </form>
        )}

        <p className="text-center text-text-light mt-6 text-sm">
          Already have an account? <Link to="/login" className="text-primary font-medium hover:underline">Sign In</Link>
        </p>
      </div>
    </div>
  );
}
