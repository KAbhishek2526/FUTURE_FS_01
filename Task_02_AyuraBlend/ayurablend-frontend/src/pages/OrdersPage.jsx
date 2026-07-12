import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

export default function OrdersPage() {
  const { user, loading: authLoading } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login');
    } else if (user) {
      fetchOrders();
    }
  }, [user, authLoading, navigate]);

  const fetchOrders = async () => {
    try {
      // Handled natively by api interceptor!
      const { data } = await api.get('/orders/myorders');
      setOrders(data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch your order history.');
      setLoading(false);
    }
  };

  if (authLoading || loading) {
    return <div className="text-center py-20 text-gray-500">Loading Order History...</div>;
  }

  return (
    <div className="py-16 px-4 sm:px-6 md:px-8 max-w-4xl mx-auto">
      <div className="mb-6 flex justify-start">
        <button 
          onClick={() => navigate('/')} 
          className="text-sm text-primary font-medium hover:underline bg-transparent border-0 cursor-pointer p-0"
        >
          ← Back to Shop
        </button>
      </div>
      <h1 className="text-3xl md:text-4xl font-serif text-primary mb-8 border-b pb-4">My Orders</h1>
      
      {error && <div className="text-red-600 bg-red-50 p-4 rounded-md mb-6">{error}</div>}

      {orders.length === 0 && !error ? (
        <div className="p-8 text-center bg-white rounded-xl shadow-sm border border-gray-100">
          <p className="text-gray-500 text-lg">You have not placed any orders yet.</p>
          <button 
            onClick={() => navigate('/products')}
            className="mt-6 bg-primary text-white px-6 py-2 rounded hover:bg-primary-dim transition-colors"
          >
            Start Shopping
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          {orders.map((order) => (
            <div key={order._id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex flex-col md:flex-row md:justify-between items-start md:items-center mb-4 gap-4 md:gap-0 border-b pb-4">
                <div className="w-full md:w-auto">
                  <p className="text-sm text-gray-500">Order ID</p>
                  <p className="font-mono text-primary font-medium">{order._id}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Total Amount</p>
                  <p className="font-bold text-lg">₹{order.totalAmount.toLocaleString('en-IN')}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Status</p>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${order.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'}`}>
                    {order.status || 'Verified'}
                  </span>
                </div>
                <div className="w-full md:w-auto flex justify-between md:flex-col md:justify-start">
                  <p className="text-sm text-gray-500">Date Ordered</p>
                  <p className="font-medium">{new Date(order.createdAt).toLocaleDateString()}</p>
                </div>
              </div>

              <div>
                <h4 className="font-serif font-medium text-lg mb-3">Items Purchased</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {order.items.map((item, index) => (
                    <div key={index} className="flex gap-4 items-center bg-gray-50 p-3 rounded-lg border border-gray-100">
                      <div className="flex-1">
                        <p className="font-medium text-text">{item.name}</p>
                        <p className="text-sm text-gray-500">Qty: {item.quantity} × ₹{item.price}</p>
                      </div>
                      <p className="font-bold">₹{item.price * item.quantity}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
