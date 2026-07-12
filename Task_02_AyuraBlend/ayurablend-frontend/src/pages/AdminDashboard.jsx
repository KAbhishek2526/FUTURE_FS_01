import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import logoImg from '../assets/ayur_blend_logo.png';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { user, logoutContext } = useContext(AuthContext);
  const [activeMainTab, setActiveMainTab] = useState('overview'); // Tabs: overview, inventory, orders

  // Data states
  const [metrics, setMetrics] = useState({ revenue: 0, aov: 0, totalOrders: 0, totalProducts: 0, lowStockCount: 0 });
  const [lowStockAlerts, setLowStockAlerts] = useState([]);
  const [categorySales, setCategorySales] = useState([]);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);

  // UI state managers
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Inventory Edit states
  const [editingProductId, setEditingProductId] = useState(null);
  const [tempStockValue, setTempStockValue] = useState(0);
  const [stockUpdatingId, setStockUpdatingId] = useState(null);

  // Orders Fulfillment Tab state managers
  const [activeFulfillmentTab, setActiveFulfillmentTab] = useState('Active'); // Tabs: Active, Completed, All
  const [updatingOrderId, setUpdatingOrderId] = useState(null);
  const [notesInput, setNotesInput] = useState({});

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError('');

      // 1. Fetch aggregated stats
      const statsRes = await api.get('/admin/stats');
      if (statsRes.data) {
        setMetrics({
          revenue: statsRes.data.revenue || 0,
          aov: statsRes.data.aov || 0,
          totalOrders: statsRes.data.totalOrders || 0,
          totalProducts: statsRes.data.totalProducts || 0,
          lowStockCount: statsRes.data.lowStockCount || 0
        });
        setLowStockAlerts(statsRes.data.lowStockAlerts || []);
        setCategorySales(statsRes.data.categorySales || []);
      }

      // 2. Fetch all products (for Inventory)
      const productsRes = await api.get('/products');
      setProducts(productsRes.data || []);

      // 3. Fetch all orders (for Fulfillment queue)
      const ordersRes = await api.get('/admin/orders');
      if (ordersRes.data.success) {
        setOrders(ordersRes.data.orders);
      }

      setLoading(false);
    } catch (err) {
      console.error('Failed to retrieve system operations data:', err);
      setError('Connection refused or unauthorized. Please verify backend state.');
      setLoading(false);
    }
  };

  // Inventory: Save stock change
  const handleUpdateStock = async (productId) => {
    setStockUpdatingId(productId);
    try {
      const response = await api.put(`/admin/products/${productId}/stock`, {
        stock: parseInt(tempStockValue, 10)
      });
      if (response.data.product) {
        // Update products state
        setProducts(prev => 
          prev.map(p => p._id === productId ? response.data.product : p)
        );
        // Refresh metrics to recalculate low stock warnings
        const statsRes = await api.get('/admin/stats');
        setMetrics(prev => ({ ...prev, lowStockCount: statsRes.data.lowStockCount }));
        setLowStockAlerts(statsRes.data.lowStockAlerts || []);
        setEditingProductId(null);
        alert('Stock levels updated successfully!');
      }
    } catch (err) {
      alert(`Stock modification failed: ${err.response?.data?.message || err.message}`);
    } finally {
      setStockUpdatingId(null);
    }
  };

  // Orders: Update status & inject delivery notes (triggers WhatsApp for Out for Delivery)
  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    setUpdatingOrderId(orderId);
    const customNote = notesInput[orderId] || '';
    
    try {
      const response = await api.put(`/admin/orders/${orderId}/status`, {
        status: newStatus,
        deliveryNotes: customNote
      });

      if (response.data.success || response.data.order) {
        const updatedOrder = response.data.order || response.data.orderProfile;
        
        // Update orders list in state
        setOrders(prevOrders => 
          prevOrders.map(ord => 
            ord._id === orderId 
              ? { 
                  ...ord, 
                  status: updatedOrder.status, 
                  deliveryDetails: updatedOrder.deliveryDetails 
                } 
              : ord
          )
        );

        // If transitioning to "Out for Delivery", trigger client-side WhatsApp window deep-link
        if (newStatus === 'Out for Delivery') {
          try {
            const recipientPhone = updatedOrder.deliveryDetails?.phone || updatedOrder.phone || '';
            const recipientName = updatedOrder.deliveryDetails?.name || updatedOrder.name || 'Valued Customer';
            
            let cleanPhone = recipientPhone.replace(/\D/g, '');
            if (!cleanPhone.startsWith('91') && cleanPhone.length === 10) {
              cleanPhone = '91' + cleanPhone;
            }

            const message = `Hello ${recipientName}! Your Ayura Blend order is now *Out for Delivery*! 🌿\n\nCourier Note: ${customNote || 'Our courier is on the way.'}\n\nThank you for trusting us with your health journey!`;
            const encodedMessage = encodeURIComponent(message);
            const whatsappUrl = `https://api.whatsapp.com/send/?phone=${cleanPhone}&text=${encodedMessage}`;
            window.open(whatsappUrl, '_blank');
          } catch (waErr) {
            console.error("WhatsApp trigger error:", waErr);
          }
        }

        alert(`Order status successfully updated to: ${newStatus}`);
      }
    } catch (err) {
      alert(`Fulfillment status update failed: ${err.response?.data?.message || err.message}`);
    } finally {
      setUpdatingOrderId(null);
    }
  };

  const handleNoteChange = (orderId, value) => {
    setNotesInput(prev => ({ ...prev, [orderId]: value }));
  };

  // Filter orders for Fulfillment Tab
  const filteredOrders = orders.filter(order => {
    if (activeFulfillmentTab === 'Active') return ['Paid', 'Out for Delivery'].includes(order.status);
    if (activeFulfillmentTab === 'Completed') return ['Delivered', 'Cancelled'].includes(order.status);
    return true; // All
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F4F1EA]/30 flex items-center justify-center font-sans">
        <p className="text-xs uppercase tracking-widest text-[#2C4A3E] font-semibold animate-pulse">Syncing AyuraBlend Operations...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F4F1EA]/20 p-6 md:p-12 font-sans text-neutral-800">
      <div className="max-w-6xl mx-auto space-y-10">
        
        {/* Header Block */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-neutral-200/60 pb-6 gap-6">
          <div className="flex items-center gap-4">
            <img src={logoImg} alt="AyuraBlend Logo" className="h-12 w-12 object-contain rounded-full bg-white p-0.5 border" />
            <div>
              <h1 className="font-serif text-3xl font-medium text-[#2C4A3E]">AyuraBlend Command Center</h1>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-[10px] uppercase tracking-widest text-neutral-400 font-bold">Founders Operational Hub</span>
                <span className="text-neutral-300">•</span>
                <Link to="/" className="text-[10px] uppercase tracking-widest text-[#2C4A3E] font-bold hover:underline">← View Storefront</Link>
                <span className="text-neutral-300">•</span>
                <button 
                  onClick={() => { logoutContext(); navigate('/login'); }}
                  className="text-[10px] uppercase tracking-widest text-red-600 font-bold hover:underline bg-transparent border-0 cursor-pointer p-0"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
          
          {/* Main Module Tab Selector */}
          <div className="flex border border-neutral-200 bg-white p-1 rounded gap-1 shadow-2xs">
            {[
              { id: 'overview', name: 'Overview' },
              { id: 'inventory', name: 'Inventory & Stocks' },
              { id: 'orders', name: 'Fulfillment Queue' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveMainTab(tab.id)}
                className={`text-xs uppercase tracking-wider font-semibold px-4 py-2.5 rounded transition-all cursor-pointer ${
                  activeMainTab === tab.id ? 'bg-[#2C4A3E] text-white' : 'text-neutral-500 hover:text-[#2C4A3E]'
                }`}
              >
                {tab.name}
              </button>
            ))}
          </div>
        </div>

        {error && (
          <div className="bg-red-50 text-red-700 border border-red-100 p-4 rounded text-sm font-medium">
            ⚠️ {error}
          </div>
        )}

        {/* ================= OVERVIEW TAB ================= */}
        {activeMainTab === 'overview' && (
          <div className="space-y-8 animate-fadeIn">
            
            {/* Metrics Dashboard Row */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              
              <div className="bg-white border border-neutral-200/70 p-6 rounded shadow-3xs">
                <span className="text-[10px] uppercase tracking-widest text-neutral-400 font-bold">Gross Sales</span>
                <h3 className="font-serif text-2xl text-[#2C4A3E] font-medium mt-1">₹{metrics.revenue.toLocaleString('en-IN')}</h3>
                <p className="text-[10px] text-neutral-400 mt-1">Gross paid revenue aggregates</p>
              </div>

              <div className="bg-white border border-neutral-200/70 p-6 rounded shadow-3xs">
                <span className="text-[10px] uppercase tracking-widest text-neutral-400 font-bold">Avg Order Value</span>
                <h3 className="font-serif text-2xl text-[#2C4A3E] font-medium mt-1">₹{metrics.aov.toLocaleString('en-IN')}</h3>
                <p className="text-[10px] text-neutral-400 mt-1">Calculated from paid orders</p>
              </div>

              <div className="bg-white border border-neutral-200/70 p-6 rounded shadow-3xs">
                <span className="text-[10px] uppercase tracking-widest text-neutral-400 font-bold">Transactions</span>
                <h3 className="font-serif text-2xl text-[#2C4A3E] font-medium mt-1">{metrics.totalOrders}</h3>
                <p className="text-[10px] text-neutral-400 mt-1">Total order profiles generated</p>
              </div>

              <div className="bg-white border border-neutral-200/70 p-6 rounded shadow-3xs border-amber-200/70 bg-amber-50/20">
                <span className="text-[10px] uppercase tracking-widest text-amber-800 font-bold">Low Stock Warning</span>
                <h3 className="font-serif text-2xl text-amber-700 font-medium mt-1">{metrics.lowStockCount}</h3>
                <p className="text-[10px] text-amber-600 mt-1">Products with stock &lt;= 15</p>
              </div>

            </div>

            {/* Sub Activity Panels */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* Left Column: Recent Orders */}
              <div className="lg:col-span-7 bg-white border border-neutral-200/70 rounded p-6 space-y-4">
                <div className="flex justify-between items-center border-b border-neutral-100 pb-3">
                  <h3 className="font-serif text-lg text-[#2C4A3E] font-medium">Recent Transactions</h3>
                  <button onClick={() => setActiveMainTab('orders')} className="text-xs text-[#2C4A3E] underline font-medium cursor-pointer">
                    Manage All
                  </button>
                </div>

                <div className="divide-y divide-neutral-100">
                  {orders.slice(0, 5).map(order => (
                    <div key={order._id} className="py-3 flex justify-between items-center text-xs">
                      <div>
                        <p className="font-semibold text-neutral-800">
                          {order.deliveryDetails?.name || 'Customer'}
                        </p>
                        <p className="text-neutral-400 font-mono mt-0.5">
                          ID: {order._id.slice(-6).toUpperCase()} • {new Date(order.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-[#2C4A3E]">₹{order.totalAmount}</p>
                        <span className={`inline-block text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded font-semibold mt-1 ${
                          order.status === 'Paid' ? 'bg-emerald-50 text-emerald-700' :
                          order.status === 'Out for Delivery' ? 'bg-amber-50 text-amber-700' :
                          'bg-neutral-50 text-neutral-500'
                        }`}>
                          {order.status}
                        </span>
                      </div>
                    </div>
                  ))}
                  {orders.length === 0 && (
                    <p className="text-neutral-400 text-xs py-4 text-center">No orders created in local database yet.</p>
                  )}
                </div>
              </div>

              {/* Right Column: Low Stock Alerts */}
              <div className="lg:col-span-5 bg-white border border-neutral-200/70 rounded p-6 space-y-4">
                <h3 className="font-serif text-lg text-[#2C4A3E] font-medium border-b border-neutral-100 pb-3">
                  Restock Alerts
                </h3>

                <div className="space-y-3">
                  {lowStockAlerts.map(prod => (
                    <div key={prod._id} className="flex justify-between items-center text-xs bg-amber-50/40 border border-amber-100/30 p-3 rounded">
                      <div>
                        <p className="font-medium text-neutral-800">{prod.name}</p>
                        <p className="text-[10px] text-neutral-400 mt-0.5">{prod.category} • Current stock: <span className="font-bold text-red-600">{prod.stock}</span></p>
                      </div>
                      <button 
                        onClick={() => {
                          setEditingProductId(prod._id);
                          setTempStockValue(prod.stock);
                          setActiveMainTab('inventory');
                        }}
                        className="bg-white border border-neutral-200 hover:border-[#2C4A3E] text-neutral-600 hover:text-[#2C4A3E] px-2.5 py-1 rounded text-[10px] uppercase font-bold transition-all cursor-pointer"
                      >
                        Adjust
                      </button>
                    </div>
                  ))}
                  {lowStockAlerts.length === 0 && (
                    <p className="text-neutral-400 text-xs py-4 text-center">✅ All products are cleanly stocked above safety thresholds.</p>
                  )}
                </div>
              </div>

            </div>
          </div>
        )}

        {/* ================= INVENTORY TAB ================= */}
        {activeMainTab === 'inventory' && (
          <div className="bg-white border border-neutral-200/70 rounded overflow-hidden shadow-xs animate-fadeIn">
            <div className="p-6 border-b border-neutral-100 flex justify-between items-center">
              <div>
                <h3 className="font-serif text-xl text-[#2C4A3E] font-medium">Catalog Inventory</h3>
                <p className="text-xs text-neutral-400 mt-0.5">Edit live stock quantities directly in the tables below</p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-neutral-50 text-neutral-400 uppercase tracking-wider text-[10px] font-semibold border-b border-neutral-200/50">
                    <th className="py-4 px-6">Product Details</th>
                    <th className="py-4 px-6">Category</th>
                    <th className="py-4 px-6">Price</th>
                    <th className="py-4 px-6">Stock Level</th>
                    <th className="py-4 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100 font-medium">
                  {products.map(prod => (
                    <tr key={prod._id} className="hover:bg-neutral-50/40 transition-colors">
                      <td className="py-4 px-6 flex items-center gap-3">
                        <img 
                          src={prod.image || 'https://picsum.photos/400'} 
                          alt={prod.name}
                          className="w-10 h-10 object-cover rounded border border-neutral-200"
                        />
                        <div>
                          <p className="font-semibold text-neutral-800 text-sm">{prod.name}</p>
                          <p className="text-[10px] text-neutral-400 font-mono mt-0.5">SKU: {prod._id.slice(-6).toUpperCase()}</p>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-neutral-500">{prod.category}</td>
                      <td className="py-4 px-6 font-bold text-neutral-800">₹{prod.price}</td>
                      <td className="py-4 px-6">
                        {editingProductId === prod._id ? (
                          <div className="flex items-center gap-2">
                            <button 
                              onClick={() => setTempStockValue(prev => Math.max(0, prev - 1))}
                              className="px-2 py-1 bg-neutral-100 border border-neutral-200 hover:bg-neutral-200 rounded font-bold cursor-pointer"
                            >
                              -
                            </button>
                            <input 
                              type="number"
                              value={tempStockValue}
                              onChange={(e) => setTempStockValue(Math.max(0, parseInt(e.target.value, 10) || 0))}
                              className="w-16 bg-neutral-50 border border-neutral-200 text-center font-bold px-1 py-1 rounded"
                            />
                            <button 
                              onClick={() => setTempStockValue(prev => prev + 1)}
                              className="px-2 py-1 bg-neutral-100 border border-neutral-200 hover:bg-neutral-200 rounded font-bold cursor-pointer"
                            >
                              +
                            </button>
                          </div>
                        ) : (
                          <span className={`inline-block font-bold px-2 py-1 rounded ${
                            prod.stock <= 15 ? 'text-red-700 bg-red-50' : 'text-neutral-700 bg-neutral-100'
                          }`}>
                            {prod.stock} units
                          </span>
                        )}
                      </td>
                      <td className="py-4 px-6 text-right">
                        {editingProductId === prod._id ? (
                          <div className="flex justify-end gap-2">
                            <button 
                              onClick={() => handleUpdateStock(prod._id)}
                              disabled={stockUpdatingId === prod._id}
                              className="bg-[#2C4A3E] hover:bg-[#20372D] text-white px-3 py-1.5 rounded text-[10px] uppercase font-bold transition-all cursor-pointer"
                            >
                              Save
                            </button>
                            <button 
                              onClick={() => setEditingProductId(null)}
                              className="bg-white border border-neutral-200 hover:bg-neutral-50 text-neutral-500 px-3 py-1.5 rounded text-[10px] uppercase font-bold transition-all cursor-pointer"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <button 
                            onClick={() => {
                              setEditingProductId(prod._id);
                              setTempStockValue(prod.stock);
                            }}
                            className="bg-white border border-neutral-200 hover:border-[#2C4A3E] text-neutral-600 hover:text-[#2C4A3E] px-3 py-1.5 rounded text-[10px] uppercase font-bold transition-all cursor-pointer"
                          >
                            Edit Stock
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ================= ORDERS / FULFILLMENT TAB ================= */}
        {activeMainTab === 'orders' && (
          <div className="space-y-6 animate-fadeIn">
            
            {/* Fulfillment Sub-filters */}
            <div className="flex justify-between items-center border-b border-neutral-200/60 pb-3">
              <h3 className="font-serif text-xl text-[#2C4A3E] font-medium">Manual Fulfillment Queue</h3>
              
              <div className="flex border border-neutral-200 bg-white p-1 rounded gap-1 shadow-2xs">
                {['Active', 'Completed', 'All'].map(tab => (
                  <button
                    key={tab}
                    onClick={() => setActiveFulfillmentTab(tab)}
                    className={`text-xs uppercase tracking-wider font-semibold px-3 py-1.5 rounded transition-all cursor-pointer ${
                      activeFulfillmentTab === tab ? 'bg-[#2C4A3E] text-white' : 'text-neutral-500 hover:text-[#2C4A3E]'
                    }`}
                  >
                    {tab} ({orders.filter(o => tab === 'All' ? true : tab === 'Completed' ? ['Delivered', 'Cancelled'].includes(o.status) : ['Paid', 'Out for Delivery'].includes(o.status)).length})
                  </button>
                ))}
              </div>
            </div>

            {/* Orders Iteration List */}
            {filteredOrders.length === 0 ? (
              <div className="text-center py-20 bg-white border border-neutral-200/50 rounded">
                <p className="text-sm text-neutral-400">No transactions currently sit in this operational state bucket.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6">
                {filteredOrders.map(order => (
                  <div key={order._id} className="bg-white border border-neutral-200/70 rounded p-6 shadow-xs flex flex-col lg:flex-row justify-between gap-6">
                    
                    {/* Left Side: Order & Logistics Metadata */}
                    <div className="space-y-4 max-w-xl">
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-mono bg-neutral-100 text-neutral-600 px-2 py-1 rounded">
                          ID: {order._id.slice(-6).toUpperCase()}
                        </span>
                        <span className={`text-xs uppercase tracking-widest font-bold px-2.5 py-0.5 rounded ${
                          order.status === 'Paid' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' :
                          order.status === 'Out for Delivery' ? 'bg-amber-50 text-amber-700 border border-amber-100' :
                          order.status === 'Delivered' ? 'bg-green-50 text-green-700 border border-green-100' :
                          'bg-neutral-100 text-neutral-700'
                        }`}>
                          {order.status}
                        </span>
                      </div>

                      {/* Purchased Items List Summary */}
                      <div>
                        <h3 className="text-xs uppercase tracking-wider text-neutral-400 font-semibold mb-1">Manifest Items</h3>
                        <ul className="text-sm space-y-0.5 font-medium">
                          {order.items.map((item, idx) => (
                            <li key={idx} className="text-neutral-700">
                              {item.name} <span className="text-neutral-400 font-normal">x{item.quantity}</span>
                            </li>
                          ))}
                        </ul>
                        <p className="text-sm font-semibold text-[#2C4A3E] mt-2">Total Amount: ₹{order.totalAmount}</p>
                      </div>

                      {/* Delivery Location Routing Block */}
                      <div className="pt-2 border-t border-neutral-100">
                        <h3 className="text-xs uppercase tracking-wider text-neutral-400 font-semibold mb-1">Shipping Details</h3>
                        <p className="text-sm font-semibold">{order.deliveryDetails?.name || order.name} — <span className="text-neutral-600">{order.deliveryDetails?.phone || order.phone}</span></p>
                        <p className="text-sm text-neutral-600 mt-0.5 leading-relaxed">{order.deliveryDetails?.address || order.address}, Pincode: {order.deliveryDetails?.pincode || '522001'}</p>
                        {order.deliveryDetails?.deliveryNotes && (
                          <p className="text-xs bg-amber-50/70 border border-amber-100/60 text-amber-800 p-2 rounded mt-2 font-medium">
                            📝 Current Courier Note: "{order.deliveryDetails.deliveryNotes}"
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Right Side: Manual Action Management Actions */}
                    <div className="lg:w-80 flex flex-col justify-between border-t lg:border-t-0 lg:border-l border-neutral-100 pt-6 lg:pt-0 lg:pl-6 space-y-4">
                      <div className="space-y-2">
                        <label className="text-xs uppercase tracking-wider text-neutral-500 font-medium">Update Delivery Note / Tracking Details</label>
                        <input
                          type="text"
                          placeholder="e.g. Dispatched via local courier, Arriving at 4 PM"
                          value={notesInput[order._id] !== undefined ? notesInput[order._id] : (order.deliveryDetails?.deliveryNotes || '')}
                          onChange={(e) => handleNoteChange(order._id, e.target.value)}
                          className="w-full bg-neutral-50 border border-neutral-200 px-3 py-2 text-xs focus:outline-hidden focus:border-[#2C4A3E] rounded transition-all"
                        />
                      </div>

                      {/* Dynamic Action Trigger System */}
                      <div className="space-y-2">
                        {order.status === 'Paid' && (
                          <button
                            onClick={() => handleUpdateOrderStatus(order._id, 'Out for Delivery')}
                            disabled={updatingOrderId === order._id}
                            className="w-full bg-amber-600 hover:bg-amber-700 text-white text-xs uppercase tracking-widest font-semibold py-3 transition-all rounded shadow-xs cursor-pointer disabled:opacity-50 border-0"
                          >
                            🚀 MARK OUT FOR DELIVERY (TRIGGERS WHATSAPP)
                          </button>
                        )}

                        {order.status === 'Out for Delivery' && (
                          <button
                            onClick={() => handleUpdateOrderStatus(order._id, 'Delivered')}
                            disabled={updatingOrderId === order._id}
                            className="w-full bg-[#2C4A3E] hover:bg-[#20372D] text-white text-xs uppercase tracking-widest font-semibold py-3 transition-all rounded shadow-xs cursor-pointer disabled:opacity-50 border-0"
                          >
                            ✅ MARK AS FULLY DELIVERED
                          </button>
                        )}

                        {order.status !== 'Delivered' && order.status !== 'Cancelled' && (
                          <button
                            onClick={() => { if(confirm('Cancel this order profile?')) handleUpdateOrderStatus(order._id, 'Cancelled') }}
                            disabled={updatingOrderId === order._id}
                            className="w-full bg-white hover:bg-red-50 text-red-600 text-xs uppercase tracking-widest font-semibold py-2 border border-neutral-200 transition-all rounded cursor-pointer disabled:opacity-50 text-center"
                          >
                            Cancel Order
                          </button>
                        )}
                      </div>
                    </div>

                  </div>
                ))}
              </div>
            )}

          </div>
        )}

      </div>
    </div>
  );
}
