import React from 'react';
import { Link } from 'react-router-dom';

export default function OrderFailurePage() {
  return (
    <div className="py-24 px-8 text-center flex flex-col justify-center items-center h-full">
      <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mb-8 mx-auto">
        <svg className="w-12 h-12 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </div>
      <h1 className="text-4xl font-serif text-red-700 mb-4">Payment Failed</h1>
      <p className="text-xl text-text-light mb-10">We couldn't process your payment. Please try again or use WhatsApp to complete your order.</p>
      <div className="flex gap-4">
        <Link to="/checkout" className="bg-white border-2 border-primary text-primary font-medium text-lg px-8 py-3 rounded-md hover:bg-gray-50 transition-colors inline-block">
          Try Again
        </Link>
        <a href="#" className="bg-green-600 text-white font-medium text-lg px-8 py-3 rounded-md hover:bg-green-700 transition-colors inline-block">
          Order via WhatsApp
        </a>
      </div>
    </div>
  );
}
