import React from 'react';
import { Link } from 'react-router-dom';

export default function CartPage({ cartItems = [], updateQuantity, removeFromCart, clearCart }) {
  const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  if (cartItems.length === 0) {
    return (
      <div className="py-16 px-8 max-w-4xl mx-auto">
        <h1 className="text-4xl font-serif text-primary mb-10 text-center">Your Cart</h1>
        <div className="bg-surface p-8 rounded-xl shadow-sm border border-gray-100 text-center">
          <p className="text-text-light text-xl mb-8">Cart is empty.</p>
          <Link to="/" className="bg-primary text-white px-8 py-3 rounded-md hover:bg-primary-dim transition-colors inline-block font-medium">
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="py-16 px-4 md:px-8 max-w-5xl mx-auto">
      <div className="mb-6 flex justify-start">
        <Link to="/" className="text-sm text-primary font-medium hover:underline">
          ← Back to Shop
        </Link>
      </div>
      <h1 className="text-4xl font-serif text-primary mb-10 text-center md:text-left">Your Cart</h1>
      
      <div className="bg-surface p-4 md:p-8 rounded-xl shadow-sm border border-gray-100">
        
        <div className="mb-6 hidden md:grid grid-cols-12 gap-4 text-text-light font-medium pb-4 border-b border-gray-100">
          <div className="col-span-5">Product</div>
          <div className="col-span-2 text-center">Price</div>
          <div className="col-span-3 text-center">Quantity</div>
          <div className="col-span-2 text-right">Total</div>
        </div>

        <div className="flex flex-col gap-6">
          {cartItems.map((item) => (
            <div key={item._id} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center pb-6 border-b border-gray-50 last:border-b-0 last:pb-0">
              
              <div className="col-span-1 md:col-span-5 flex flex-col sm:flex-row items-center sm:items-start md:items-center gap-4 text-center sm:text-left">
                <img 
                  src={item.image} 
                  alt={item.name} 
                  onError={(e) => { e.target.onerror = null; e.target.src="https://picsum.photos/400"; }}
                  className="w-24 h-24 object-cover rounded-md shadow-sm" 
                />
                <div className="flex flex-col justify-center">
                  <h3 className="text-lg font-medium text-text mb-1">{item.name}</h3>
                  <button 
                    onClick={() => removeFromCart(item._id)}
                    className="text-sm text-red-500 hover:text-red-700 transition-colors uppercase font-medium tracking-wide mt-1"
                  >
                    Remove
                  </button>
                </div>
              </div>
              
              <div className="col-span-1 md:col-span-2 text-center text-text-light flex justify-between md:block px-4 md:px-0">
                <span className="md:hidden font-medium text-text">Price:</span> 
                ₹{item.price}
              </div>
              
              <div className="col-span-1 md:col-span-3 flex justify-between md:justify-center items-center px-4 md:px-0">
                <span className="md:hidden font-medium text-text">Quantity:</span> 
                <div className="flex items-center gap-1 bg-bg border border-gray-200 rounded-md p-1">
                  <button 
                    onClick={() => updateQuantity(item._id, -1)}
                    className="w-8 h-8 flex items-center justify-center text-text-light hover:bg-gray-100 rounded-sm transition-colors text-lg"
                  >
                    -
                  </button>
                  <span className="w-8 text-center font-medium text-text">{item.quantity}</span>
                  <button 
                    onClick={() => updateQuantity(item._id, 1)}
                    className="w-8 h-8 flex items-center justify-center text-text-light hover:bg-gray-100 rounded-sm transition-colors text-lg"
                  >
                    +
                  </button>
                </div>
              </div>
              
              <div className="col-span-1 md:col-span-2 text-right font-semibold text-primary px-4 md:px-0 flex justify-between md:block">
                <span className="md:hidden text-text font-medium text-left">Total:</span> 
                ₹{item.price * item.quantity}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 pt-6 border-t border-gray-200">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <button 
              onClick={clearCart}
              className="text-red-500 hover:text-red-700 font-medium transition-colors w-full md:w-auto text-left"
            >
              Clear Cart
            </button>

            <div className="w-full md:w-auto flex flex-col items-end gap-6 text-center md:text-right">
              <div className="flex justify-between w-full md:w-auto md:justify-end gap-8 text-2xl font-serif text-primary border-b border-gray-100 pb-4">
                <span>Subtotal</span>
                <span>₹{total}</span>
              </div>
              
              <Link to="/checkout" className="bg-primary w-full md:w-auto text-white px-10 py-4 rounded-md hover:bg-primary-dim transition-colors text-center block font-medium shadow-sm">
                Proceed to Checkout
              </Link>
            </div>
          </div>
        </div>
        
      </div>
    </div>
  );
}
