const axios = require('axios');

/**
 * Format local Indian numbers to clean E.164 string format without symbols
 * @param {string} phone 
 * @returns {string}
 */
const formatIndianNumber = (phone) => {
  if (!phone) return '';
  let cleaned = phone.replace(/\D/g, ''); // Remove non-digits
  
  // If it starts with 91 and has 12 digits, it is already in 91xxxxxxxxxx format
  if (cleaned.length === 12 && cleaned.startsWith('91')) {
    return cleaned;
  }
  
  // If it starts with 0 and has 11 digits, strip leading 0 and prepend 91
  if (cleaned.length === 11 && cleaned.startsWith('0')) {
    return `91${cleaned.slice(1)}`;
  }
  
  // If it is 10 digits, prepend 91
  if (cleaned.length === 10) {
    return `91${cleaned}`;
  }
  
  return cleaned;
};

/**
 * Sends a pre-approved WhatsApp Business template message to a customer
 * @param {string} recipientPhone - Customer's phone number
 * @param {string} templateName - Approved Meta template name (e.g., 'order_confirmation')
 * @param {string} languageCode - 'en' or 'te' (Telugu)
 * @param {Array<string>} variables - Dynamic strings to map into template tokens {{1}}, {{2}}, etc.
 */
exports.sendWhatsAppTemplate = async (recipientPhone, templateName, languageCode = 'en', variables = []) => {
  const phoneId = process.env.WHATSAPP_PHONE_NUMBER_ID ? process.env.WHATSAPP_PHONE_NUMBER_ID.trim() : null;
  const accessToken = process.env.WHATSAPP_ACCESS_TOKEN ? process.env.WHATSAPP_ACCESS_TOKEN.trim() : null;

  if (!phoneId || !accessToken) {
    console.warn('⚠️ WhatsApp notification skipped: Missing credentials in environment configuration.');
    return null;
  }

  const formattedPhone = formatIndianNumber(recipientPhone);
  const url = `https://graph.facebook.com/v18.0/${phoneId}/messages`;

  // Construct Meta utility component array from simple raw text variables
  const parameters = variables.map(val => ({
    type: 'text',
    text: String(val)
  }));

  const payload = {
    messaging_product: 'whatsapp',
    recipient_type: 'individual',
    to: formattedPhone,
    type: 'template',
    template: {
      name: templateName,
      language: {
        code: languageCode
      },
      components: [
        {
          type: 'body',
          parameters: parameters
        }
      ]
    }
  };

  try {
    const response = await axios.post(url, payload, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    });
    console.log(`✅ WhatsApp alert successfully transmitted via Meta API. Message ID: ${response.data.messages?.[0]?.id}`);
    return response.data;
  } catch (error) {
    console.error('❌ Meta WhatsApp API Hub Error:', error.response?.data || error.message);
    return null;
  }
};
