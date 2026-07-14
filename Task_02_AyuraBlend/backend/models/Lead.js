const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema(
  {
    text: { type: String, required: true },
    addedBy: { type: String, default: 'CRM Agent' },
  },
  { timestamps: true }
);

const leadSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    phone: { type: String, trim: true, default: '' },
    source: {
      type: String,
      enum: ['Website', 'Referral', 'Social Media', 'Advertisement', 'Cold Call', 'Other'],
      default: 'Other',
    },
    status: {
      type: String,
      enum: ['New', 'Contacted', 'Qualified', 'Proposal Sent', 'Won', 'Lost'],
      default: 'New',
    },
    product: { type: String, trim: true, default: '' },
    value: { type: Number, default: 0 },
    notes: [noteSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Lead', leadSchema);
