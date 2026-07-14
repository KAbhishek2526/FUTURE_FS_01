/**
 * seedLeads.js — Populate the CRM with 5 realistic sample leads
 * Usage: node seedLeads.js
 */
const mongoose = require('mongoose');
const Lead = require('./models/Lead');
require('dotenv').config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/ayurablend';

const sampleLeads = [
  {
    name: 'Priya Sharma',
    email: 'priya.sharma@wellness.in',
    phone: '9876543210',
    source: 'Website',
    status: 'New',
    product: 'Ayur Moringa Spice',
    value: 499,
    notes: [{ text: 'Interested in bulk order for family wellness', addedBy: 'CRM Admin' }],
  },
  {
    name: 'Ravi Kiran',
    email: 'ravi.kiran@healthhub.co',
    phone: '9823456710',
    source: 'Referral',
    status: 'Qualified',
    product: 'Ayur Moringa Vital',
    value: 1200,
    notes: [
      { text: 'Met at Hyderabad Wellness Expo 2025', addedBy: 'CRM Admin' },
      { text: 'Requested a product demo kit', addedBy: 'CRM Admin' },
    ],
  },
  {
    name: 'Ananya Reddy',
    email: 'ananya.r@gmail.com',
    phone: '9000112233',
    source: 'Social Media',
    status: 'Contacted',
    product: 'Ayur Moringa Pure',
    value: 349,
    notes: [{ text: 'Reached out via Instagram DM', addedBy: 'CRM Admin' }],
  },
  {
    name: 'Suresh Babu',
    email: 'suresh.babu@organicmart.com',
    phone: '9412034567',
    source: 'Advertisement',
    status: 'Proposal Sent',
    product: 'Ayur Moringa Spice',
    value: 4500,
    notes: [
      { text: 'Owns chain of 3 organic stores in Bengaluru', addedBy: 'CRM Admin' },
      { text: 'Sent wholesale pricing proposal via email', addedBy: 'CRM Admin' },
    ],
  },
  {
    name: 'Meena Iyer',
    email: 'meena.iyer@fitlife.in',
    phone: '9561234780',
    source: 'Cold Call',
    status: 'Won',
    product: 'Ayur Moringa Vital',
    value: 2800,
    notes: [{ text: 'Closed deal — first order dispatched on 10 Jul', addedBy: 'CRM Admin' }],
  },
];

async function seedLeads() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB');

    const existingCount = await Lead.countDocuments();
    if (existingCount > 0) {
      console.log(`ℹ️  ${existingCount} leads already exist — skipping seed to avoid duplicates.`);
      console.log('   Run with --force flag to clear and re-seed: node seedLeads.js --force');

      if (process.argv.includes('--force')) {
        await Lead.deleteMany({});
        console.log('🗑️  Cleared existing leads (--force mode)');
      } else {
        process.exit(0);
      }
    }

    const inserted = await Lead.insertMany(sampleLeads);
    console.log(`🌱 Seeded ${inserted.length} leads successfully:`);
    inserted.forEach(l => console.log(`   • [${l.status}] ${l.name} — ${l.email}`));
    process.exit(0);
  } catch (err) {
    console.error('❌ Seed error:', err.message);
    process.exit(1);
  }
}

seedLeads();
