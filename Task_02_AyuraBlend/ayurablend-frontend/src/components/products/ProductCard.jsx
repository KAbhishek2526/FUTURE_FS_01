import React from 'react';
import { Link } from 'react-router-dom';

export default function ProductCard({ product, addToCart }) {
  return (
    <div className="bg-surface rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-gray-100 flex flex-col h-full">
      <Link to={`/product/${product._id}`} className="block relative h-64 overflow-hidden">
        <img 
          src={product.image} 
          alt={product.name} 
          onError={(e) => { e.target.onerror = null; e.target.src="https://picsum.photos/400"; }}
          className="w-full h-full object-cover transition-transform hover:scale-105 duration-300" 
        />
      </Link>
      <div className="p-6 flex flex-col flex-grow">
        <Link to={`/product/${product._id}`}>
          <h3 className="text-lg font-medium text-text hover:text-primary transition-colors">{product.name}</h3>
        </Link>
        <p className="text-primary font-semibold mt-2 mb-4">₹{product.price}</p>
        <button 
          onClick={() => addToCart(product)}
          className="mt-auto bg-primary text-white w-full py-2.5 rounded-md hover:bg-primary-dim transition-colors cursor-pointer font-medium"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
}
