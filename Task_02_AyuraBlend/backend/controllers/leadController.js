const Lead = require('../models/Lead');

// ─────────────────────────────────────────────
// POST /api/leads  — Capture a new lead
// ─────────────────────────────────────────────
exports.createLead = async (req, res) => {
  try {
    const { name, email, phone, source, status, product, value } = req.body;

    if (!name || !email) {
      return res.status(400).json({ message: 'Name and email are required.' });
    }

    const lead = new Lead({ name, email, phone, source, status, product, value });
    const savedLead = await lead.save();

    console.log(`[CRM] New lead created: ${savedLead._id} — ${savedLead.name}`);
    return res.status(201).json(savedLead);
  } catch (error) {
    console.error('[CRM] createLead Error:', error);
    res.status(500).json({ message: 'Server error creating lead.', error: error.message });
  }
};

// ─────────────────────────────────────────────
// GET /api/leads  — Fetch all leads
// ─────────────────────────────────────────────
exports.getAllLeads = async (req, res) => {
  try {
    const { status, source, search } = req.query;

    const filter = {};
    if (status) filter.status = status;
    if (source) filter.source = source;
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
      ];
    }

    const leads = await Lead.find(filter).sort({ createdAt: -1 });
    return res.status(200).json(leads);
  } catch (error) {
    console.error('[CRM] getAllLeads Error:', error);
    res.status(500).json({ message: 'Server error fetching leads.', error: error.message });
  }
};

// ─────────────────────────────────────────────
// GET /api/leads/:id  — Fetch a single lead
// ─────────────────────────────────────────────
exports.getLeadById = async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id);
    if (!lead) {
      return res.status(404).json({ message: 'Lead not found.' });
    }
    return res.status(200).json(lead);
  } catch (error) {
    console.error('[CRM] getLeadById Error:', error);
    res.status(500).json({ message: 'Server error fetching lead.', error: error.message });
  }
};

// ─────────────────────────────────────────────
// PUT /api/leads/:id/status  — Update lead status
// ─────────────────────────────────────────────
exports.updateLeadStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const allowedStatuses = ['New', 'Contacted', 'Qualified', 'Proposal Sent', 'Won', 'Lost'];

    if (!status || !allowedStatuses.includes(status)) {
      return res.status(400).json({
        message: `Invalid status. Allowed values: ${allowedStatuses.join(', ')}`,
      });
    }

    const lead = await Lead.findByIdAndUpdate(
      req.params.id,
      { status },
      { returnDocument: 'after', runValidators: true }
    );

    if (!lead) {
      return res.status(404).json({ message: 'Lead not found.' });
    }

    console.log(`[CRM] Lead ${lead._id} status updated to: ${status}`);
    return res.status(200).json(lead);
  } catch (error) {
    console.error('[CRM] updateLeadStatus Error:', error);
    res.status(500).json({ message: 'Server error updating lead status.', error: error.message });
  }
};

// ─────────────────────────────────────────────
// POST /api/leads/:id/notes  — Add a note to a lead
// ─────────────────────────────────────────────
exports.addNote = async (req, res) => {
  try {
    const { text, addedBy } = req.body;

    if (!text || !text.trim()) {
      return res.status(400).json({ message: 'Note text is required.' });
    }

    const lead = await Lead.findById(req.params.id);
    if (!lead) {
      return res.status(404).json({ message: 'Lead not found.' });
    }

    lead.notes.push({ text: text.trim(), addedBy: addedBy || 'CRM Agent' });
    await lead.save();

    console.log(`[CRM] Note added to lead ${lead._id}`);
    return res.status(201).json(lead);
  } catch (error) {
    console.error('[CRM] addNote Error:', error);
    res.status(500).json({ message: 'Server error adding note.', error: error.message });
  }
};

// ─────────────────────────────────────────────
// DELETE /api/leads/:id  — Delete a lead
// ─────────────────────────────────────────────
exports.deleteLead = async (req, res) => {
  try {
    const lead = await Lead.findByIdAndDelete(req.params.id);
    if (!lead) {
      return res.status(404).json({ message: 'Lead not found.' });
    }
    console.log(`[CRM] Lead deleted: ${req.params.id}`);
    return res.status(200).json({ message: 'Lead deleted successfully.' });
  } catch (error) {
    console.error('[CRM] deleteLead Error:', error);
    res.status(500).json({ message: 'Server error deleting lead.', error: error.message });
  }
};
