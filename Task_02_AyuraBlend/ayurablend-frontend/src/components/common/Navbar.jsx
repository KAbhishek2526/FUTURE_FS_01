import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import logoImg from '../../assets/ayur_blend_logo.png';

export default function Navbar({ cartCount = 0 }) {
  const { user, logoutContext } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

  const handleLogout = () => {
    logoutContext();
    navigate('/');
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="relative bg-bg border-b border-gray-200 z-50">
      <div className="flex justify-between items-center py-5 px-4 sm:px-6 md:px-8 max-w-7xl mx-auto">
        
        {/* Brand */}
        <Link to="/" className="flex items-center gap-3">
          <img src={logoImg} alt="AyuraBlend Logo" className="h-10 w-10 object-contain rounded-full" />
          <div className="flex flex-col">
            <span className="text-2xl font-serif font-bold text-primary tracking-wide leading-none">AyuraBlend</span>
            <span className="text-[8px] uppercase tracking-widest text-neutral-400 font-bold mt-1">Pure Superfoods</span>
          </div>
        </Link>
 
        {/* Desktop Navigation */}
        <div className="hidden md:flex gap-8 text-text items-center">
          <Link to="/" className="hover:text-primary transition-colors">Home</Link>
          <Link to="/products" className="hover:text-primary transition-colors">Products</Link>
          
          {user ? (
            <div className="relative">
              <button 
                onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                className="text-sm border shadow-xs border-gray-200 bg-white px-4 py-2 rounded-full text-primary font-medium hover:bg-gray-50 transition-all flex items-center gap-1 cursor-pointer"
              >
                <span>Hello, {user.name}</span>
                <svg className="w-4 h-4 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </button>

              {isProfileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-100 rounded-lg shadow-md py-2 z-50 text-xs font-semibold animate-fadeIn">
                  {user.role === 'admin' && (
                    <Link 
                      to="/admin" 
                      onClick={() => setIsProfileDropdownOpen(false)}
                      className="block px-4 py-2.5 text-neutral-600 hover:bg-neutral-50 hover:text-primary transition-colors"
                    >
                      Admin Dashboard
                    </Link>
                  )}
                  <Link 
                    to="/orders" 
                    onClick={() => setIsProfileDropdownOpen(false)}
                    className="block px-4 py-2.5 text-neutral-600 hover:bg-neutral-50 hover:text-primary transition-colors"
                  >
                    My Orders
                  </Link>
                  <button 
                    onClick={() => { setIsProfileDropdownOpen(false); handleLogout(); }}
                    className="w-full text-left block px-4 py-2.5 text-red-500 hover:bg-red-50 hover:text-red-700 transition-colors border-0 bg-transparent cursor-pointer font-semibold"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login" className="hover:text-primary transition-colors font-medium">Login / Register</Link>
          )}
        </div>

        {/* Action Elements Box (Cart + Mobile Toggle) */}
        <div className="flex items-center gap-4">
          <Link to="/cart" className="bg-primary text-white px-4 py-2 sm:px-5 sm:py-2.5 rounded-md hover:bg-primary-dim transition-colors inline-block relative text-sm sm:text-base font-medium">
            Cart ({cartCount})
          </Link>
          
          <button 
            className="md:hidden text-primary p-2 focus:outline-none" 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isMobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Navigation Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white border-b border-gray-200 shadow-sm py-4 px-4 flex flex-col gap-4 text-text">
          <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="block px-4 py-2 hover:bg-gray-50 rounded-md">Home</Link>
          <Link to="/products" onClick={() => setIsMobileMenuOpen(false)} className="block px-4 py-2 hover:bg-gray-50 rounded-md">Products</Link>
          <Link to="/cart" onClick={() => setIsMobileMenuOpen(false)} className="block px-4 py-2 hover:bg-gray-50 rounded-md">Cart ({cartCount})</Link>
          
          {user ? (
            <div className="pt-2 border-t border-gray-100 flex flex-col gap-3">
              <span className="px-4 text-primary font-medium text-xs uppercase tracking-wider">Logged in as {user.name}</span>
              {user.role === 'admin' && (
                <Link to="/admin" onClick={() => setIsMobileMenuOpen(false)} className="block px-4 py-2 hover:bg-gray-50 rounded-md font-semibold text-primary">Admin Dashboard</Link>
              )}
              <Link to="/orders" onClick={() => setIsMobileMenuOpen(false)} className="block px-4 py-2 hover:bg-gray-50 rounded-md">My Orders</Link>
              <button 
                onClick={handleLogout} 
                className="text-left w-full block px-4 py-2 text-red-500 hover:bg-red-50 rounded-md font-medium border-0 bg-transparent cursor-pointer"
              >
                Logout
              </button>
            </div>
          ) : (
             <div className="pt-2 border-t border-gray-100">
               <Link to="/login" onClick={() => setIsMobileMenuOpen(false)} className="block px-4 py-2 hover:bg-gray-50 rounded-md font-medium text-primary">Login / Register</Link>
             </div>
          )}
        </div>
      )}
    </nav>
  );
}
