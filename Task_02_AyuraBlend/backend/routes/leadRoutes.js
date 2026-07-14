const express = require('express');
const router = express.Router();
const {
  createLead,
  getAllLeads,
  getLeadById,
  updateLeadStatus,
  addNote,
  deleteLead,
} = require('../controllers/leadController');
const { uploadLeadsCSV } = require('../controllers/uploadController');

// POST   /api/leads/upload     — Bulk-import leads from a CSV file (MUST be before /:id)
router.post('/upload', uploadLeadsCSV);

// POST   /api/leads           — Capture a new lead
router.post('/', createLead);

// GET    /api/leads           — Fetch all leads (supports ?status=, ?source=, ?search=)
router.get('/', getAllLeads);

// GET    /api/leads/:id       — Fetch a single lead
router.get('/:id', getLeadById);

// PUT    /api/leads/:id/status — Update lead status
router.put('/:id/status', updateLeadStatus);

// POST   /api/leads/:id/notes — Add a note to a lead
router.post('/:id/notes', addNote);

// DELETE /api/leads/:id       — Delete a lead
router.delete('/:id', deleteLead);

module.exports = router;
