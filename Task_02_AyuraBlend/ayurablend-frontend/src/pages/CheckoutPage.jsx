import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { createOrder } from '../services/orderService';
import { AuthContext } from '../context/AuthContext';

// Helper function to load the external Razorpay script dynamically
const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

export default function CheckoutPage({ cartItems = [], clearCart }) {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useContext(AuthContext);
  
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: ''
  });
  
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login', { state: { message: "Please login to continue checkout" } });
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (cartItems.length === 0) {
      navigate('/cart');
    }
  }, [cartItems, navigate]);

  useEffect(() => {
    loadRazorpayScript();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const calculateTotal = () => {
    return cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.name.trim() || !formData.phone.trim() || !formData.address.trim()) {
      setError('All fields are required.');
      return;
    }

    const phoneClean = formData.phone.replace(/[^0-9]/g, '');
    if (phoneClean.length < 10) {
      setError('Please enter a valid phone number (min 10 digits).');
      return;
    }

    const totalAmount = calculateTotal();
    setLoading(true);

    try {
      // 1. Get Razorpay order from backend (mocked or live depending on credentials)
      let razorpayData = null;
      try {
        const res = await api.post("/orders/razorpay", { amount: totalAmount });
        razorpayData = res.data;
      } catch (err) {
        console.warn("Backend Razorpay call failed, running checkout simulation fallback.");
      }

      // 2. Prepare Order Object for DB (to be saved directly)
      const formattedItems = cartItems.map(item => ({
        product: item._id, 
        name: item.name,
        price: item.price,
        quantity: item.quantity
      }));

      const orderObject = {
        name: formData.name.trim(),
        phone: formData.phone.trim(),
        address: formData.address.trim(),
        items: formattedItems,
        totalAmount: totalAmount,
        status: "Paid"
      };

      const razorpayKey = import.meta.env.VITE_RAZORPAY_KEY_ID || (razorpayData && razorpayData.key);

      // 3. Fallback to sandbox simulation if Razorpay call failed, returned sandbox, or key is unconfigured
      if (!razorpayData || razorpayData.isSandbox || !razorpayKey || razorpayKey === 'YOUR_TEST_KEY_ID') {
        console.log("Simulating checkout animation/flow...");
        
        // Save order directly in DB
        const createdOrder = await createOrder(orderObject);
        
        if (clearCart) clearCart();
        setLoading(false);
        navigate("/order-success");

        // Trigger client-side WhatsApp workflow deep-link
        try {
          const customerPhone = formData.phone;
          const orderId = createdOrder._id || createdOrder.id || 'N/A';
          const firstItemName = cartItems[0]?.name || 'Ayur Moringa Product';
          const productName = cartItems.length > 1 ? `${firstItemName} and ${cartItems.length - 1} other(s)` : firstItemName;
          
          let cleanPhone = customerPhone.replace(/\D/g, '');
          if (!cleanPhone.startsWith('91') && cleanPhone.length === 10) {
            cleanPhone = '91' + cleanPhone;
          }

          const message = `Hello! Thank you for ordering from Ayura Blend. 🌿\n\nYour order for *${productName}* has been successfully logged (Order ID: #${orderId}). We are preparing it with absolute care. \n\n_Disclaimer: Our products are natural food supplements and are consumed as part of a balanced diet to support everyday wellness._ \n\nThank you for trusting us with your health journey!`;
          const encodedMessage = encodeURIComponent(message);
          const whatsappUrl = `https://api.whatsapp.com/send/?phone=${cleanPhone}&text=${encodedMessage}`;
          window.open(whatsappUrl, '_blank');
        } catch (waError) {}

      } else {
        // Show real Razorpay modal overlay
        if (!window.Razorpay) {
          setError("Razorpay SDK failed to load. Please check your network connection.");
          setLoading(false);
          return;
        }

        const options = {
          key: razorpayKey,
          amount: razorpayData.amount,
          currency: razorpayData.currency,
          name: "AyuraBlend",
          description: "Order Payment",
          order_id: razorpayData.id,

          handler: async function (response) {
            try {
              // Verify signature on backend
              const verifyRes = await api.post("/orders/verify", {
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature
              });

              if (verifyRes.data.success) {
                const createdOrder = await createOrder(orderObject);
                if (clearCart) clearCart();
                setLoading(false);
                navigate("/order-success");

                // Trigger client-side WhatsApp workflow deep-link
                try {
                  const customerPhone = formData.phone;
                  const orderId = createdOrder._id || createdOrder.id || 'N/A';
                  const firstItemName = cartItems[0]?.name || 'Ayur Moringa Product';
                  const productName = cartItems.length > 1 ? `${firstItemName} and ${cartItems.length - 1} other(s)` : firstItemName;
                  
                  let cleanPhone = customerPhone.replace(/\D/g, '');
                  if (!cleanPhone.startsWith('91') && cleanPhone.length === 10) {
                    cleanPhone = '91' + cleanPhone;
                  }

                  const message = `Hello! Thank you for ordering from Ayura Blend. 🌿\n\nYour order for *${productName}* has been successfully logged (Order ID: #${orderId}). We are preparing it with absolute care. \n\n_Disclaimer: Our products are natural food supplements and are consumed as part of a balanced diet to support everyday wellness._ \n\nThank you for trusting us with your health journey!`;
                  const encodedMessage = encodeURIComponent(message);
                  const whatsappUrl = `https://api.whatsapp.com/send/?phone=${cleanPhone}&text=${encodedMessage}`;
                  window.open(whatsappUrl, '_blank');
                } catch (waError) {}
              } else {
                setError('Payment verification failed!');
                setLoading(false);
              }
            } catch (verifyError) {
              setError('Payment verification check failed.');
              setLoading(false);
            }
          },

          prefill: {
            name: formData.name,
            contact: formData.phone,
          },

          theme: {
            color: "#3b7d5b",
          },
        };

        const rzp = new window.Razorpay(options);
        rzp.on('payment.failed', function (response){
          setError("Payment initialization failed");
          setLoading(false);
        });
        rzp.open();
      }

    } catch (apiError) {
      console.error("Payment init error:", apiError);
      setError(apiError.response?.data?.message || "Payment initialization failed");
      setLoading(false);
    }
  };

  if (cartItems.length === 0) return null;

  const totalAmount = calculateTotal();

  return (
    <div className="py-16 px-4 md:px-8 max-w-5xl mx-auto flex flex-col lg:flex-row gap-12">
      
      <div className="lg:w-2/3 w-full">
        <div className="mb-6 flex justify-start">
          <Link to="/cart" className="text-sm text-primary font-medium hover:underline">
            ← Back to Cart
          </Link>
        </div>
        <h1 className="text-4xl font-serif text-primary mb-8">Checkout</h1>
        
        <form onSubmit={handlePayment} className="bg-surface p-6 md:p-8 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-2xl font-serif text-primary mb-6">Shipping Details</h2>
          
          {error && (
            <div className="bg-red-50 text-red-600 border border-red-200 p-4 rounded-md mb-6 font-medium">
              {error}
            </div>
          )}
          
          <div className="flex flex-col gap-5">
            <div>
              <label className="block text-text-light mb-2 font-medium">Full Name <span className="text-red-500">*</span></label>
              <input 
                type="text" 
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-shadow bg-bg" 
                placeholder="John Doe" 
                disabled={loading}
              />
            </div>
            
            <div>
              <label className="block text-text-light mb-2 font-medium">Phone Number <span className="text-red-500">*</span></label>
              <input 
                type="tel" 
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-shadow bg-bg" 
                placeholder="+91 98765 43210" 
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-text-light mb-2 font-medium">Delivery Address <span className="text-red-500">*</span></label>
              <textarea 
                name="address"
                value={formData.address}
                onChange={handleChange}
                rows="4"
                className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-shadow bg-bg resize-none" 
                placeholder="123 Wellness Avenue, Suite 4B..." 
                disabled={loading}
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className={`w-full min-h-[44px] text-white px-8 py-4 rounded-md transition-all text-center text-lg mt-8 shadow-sm flex items-center justify-center gap-3 font-medium ${loading ? 'bg-primary/70 cursor-not-allowed scale-[0.99] opacity-80' : 'bg-primary hover:bg-primary-dim hover:shadow-md'}`}
          >
            {loading && (
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            )}
            {loading ? 'Processing Transaction...' : `Pay Securely (₹${totalAmount})`}
          </button>
        </form>
      </div>

      <div className="lg:w-1/3 w-full">
        <div className="bg-surface p-6 rounded-xl shadow-sm border border-gray-100 sticky top-10">
          <h2 className="text-2xl font-serif text-primary mb-6">Order Summary</h2>
          
          <div className="flex flex-col gap-4 mb-6 max-h-96 overflow-y-auto pr-2">
            {cartItems.map((item) => (
              <div key={item._id} className="flex justify-between items-center text-sm border-b border-gray-50 pb-4 last:border-0 last:pb-0">
                <div className="flex items-center gap-3">
                  <img 
                    src={item.image} 
                    alt={item.name} 
                    onError={(e) => { e.target.onerror = null; e.target.src="https://picsum.photos/400"; }}
                    className="w-12 h-12 object-cover rounded-md" 
                  />
                  <div className="font-medium text-text">
                    <p>{item.name}</p>
                    <p className="text-text-light text-xs">Qty: {item.quantity}</p>
                  </div>
                </div>
                <div className="font-semibold text-text">
                  ₹{item.price * item.quantity}
                </div>
              </div>
            ))}
          </div>
          
          <div className="border-t border-gray-200 pt-4 flex justify-between items-center text-xl font-serif text-primary">
            <span>Total</span>
            <span>₹{totalAmount}</span>
          </div>

          <Link to="/cart" className="block text-center mt-6 text-text-light hover:text-primary transition-colors text-sm underline pb-2">
            Edit Cart Items
          </Link>
        </div>
      </div>

    </div>
  );
}
