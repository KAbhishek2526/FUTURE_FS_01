const axios = require('axios');

class ShiprocketService {
  constructor() {
    this.token = null;
    this.baseUrl = 'https://apiv2.shiprocket.in/v1/external';
  }

  /**
   * Secure authentication connector
   * @private
   */
  async authenticate() {
    try {
      const email = process.env.SHIPROCKET_EMAIL || 'your_developer_email@example.com';
      const password = process.env.SHIPROCKET_PASSWORD || 'your_secure_sandbox_password';

      const response = await axios.post(`${this.baseUrl}/auth/login`, { email, password });

      this.token = response.data.token;
      console.log('✅ Shiprocket System Token Refreshed Successfully.');
      return this.token;
    } catch (error) {
      console.error('❌ Critical Failure Authenticating with Shiprocket API:', error.response?.data || error.message);
      throw new Error('Logistics authentication token generation failure.');
    }
  }

  /**
   * Higher-order request wrapper managing active authentication states
   * @private
   */
  async request(method, endpoint, data = {}, retry = true) {
    if (!this.token) await this.authenticate();

    try {
      return await axios({
        method,
        url: `${this.baseUrl}${endpoint}`,
        data,
        headers: { Authorization: `Bearer ${this.token}` },
      });
    } catch (error) {
      if (error.response?.status === 401 && retry) {
        console.log('⚠️ Token expired or revoked. Forcing fresh authentication routine...');
        await this.authenticate();
        return this.request(method, endpoint, data, false); // Clear retry flag to prevent execution loops
      }
      throw error;
    }
  }

  /**
   * Convert an internal AyuraBlend database order into an official Shiprocket manifest
   * @param {Object} order - Complete structural Mongoose Order instance (optionally populated with user)
   */
  async createForwardOrder(order) {
    // 1. Resolve customer details
    const email = order.user && order.user.email ? order.user.email : 'customer@ayurablend.com';
    const nameParts = (order.name || 'Valued Customer').trim().split(/\s+/);
    const firstName = nameParts[0];
    const lastName = nameParts.slice(1).join(' ') || 'Customer';

    // 2. Parse PIN code (6-digit format) and detect City/State from flat address string
    const address = order.address || '';
    const pincodeMatch = address.match(/\b\d{6}\b/);
    const pincode = pincodeMatch ? parseInt(pincodeMatch[0], 10) : 522001; // default to Guntur pincode

    let city = 'Guntur';
    let state = 'Andhra Pradesh';

    if (/karnataka|bangalore|bengaluru/i.test(address)) {
      city = 'Bengaluru';
      state = 'Karnataka';
    } else if (/maharashtra|mumbai|pune/i.test(address)) {
      city = 'Mumbai';
      state = 'Maharashtra';
    } else if (/delhi/i.test(address)) {
      city = 'Delhi';
      state = 'Delhi';
    } else if (/telangana|hyderabad/i.test(address)) {
      city = 'Hyderabad';
      state = 'Telangana';
    } else if (/tamil\s*nadu|chennai/i.test(address)) {
      city = 'Chennai';
      state = 'Tamil Nadu';
    }

    const formattedDate = new Date(order.createdAt).toISOString().slice(0, 10) + ' 18:00';
    
    // Map product details using productId as fallback SKU
    const orderItems = order.items.map(item => ({
      name: item.name,
      sku: `AB-GEN-${item.product || item._id}`,
      units: item.quantity,
      selling_price: item.price,
    }));

    // 3. Structure payload
    const payload = {
      order_id: order._id.toString(),
      order_date: formattedDate,
      pickup_location: "Primary Warehouse Guntur",
      billing_customer_name: firstName,
      billing_last_name: lastName,
      billing_address: address,
      billing_city: city,
      billing_pincode: pincode,
      billing_state: state,
      billing_country: 'India',
      billing_email: email,
      billing_phone: order.phone,
      shipping_is_billing: true,
      order_items: orderItems,
      payment_method: 'Prepaid',
      sub_total: order.totalAmount,
      length: 15, // default package dimension constants
      width: 12,
      height: 10,
      weight: 0.25
    };

    try {
      const response = await this.request('POST', '/orders/create/adhoc', payload);
      
      return {
        shiprocketOrderId: response.data.order_id,
        shipmentId: response.data.shipment_id,
        awbCode: response.data.awb_code || null,
        status: 'Manifested'
      };
    } catch (error) {
      console.error('❌ Failed to push order manifest parameters downstream:', error.response?.data || error.message);
      throw new Error(`Logistics Payload Dispatch Failure: ${JSON.stringify(error.response?.data?.errors || error.response?.data || error.message)}`);
    }
  }
}

module.exports = new ShiprocketService();
