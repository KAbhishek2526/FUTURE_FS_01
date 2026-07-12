import React from 'react';
import { Link } from 'react-router-dom';

export default function OrderSuccessPage() {
  return (
    <div className="py-24 px-8 text-center flex flex-col justify-center items-center h-full">
      <div className="w-24 h-24 bg-primary-container rounded-full flex items-center justify-center mb-8 mx-auto">
        <svg className="w-12 h-12 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <h1 className="text-4xl font-serif text-primary mb-4">Thank you for your order!</h1>
      <p className="text-xl text-text-light mb-10">Your order has been placed successfully and is being processed.</p>
      <Link to="/products" className="bg-primary text-white text-lg px-8 py-3 rounded-md hover:bg-primary-dim transition-colors inline-block">
        Continue Shopping
      </Link>
    </div>
  );
}
