const Lead = require('../models/Lead');
const multer = require('multer');
const csv = require('csv-parser');
const { Readable } = require('stream');

// ─── Multer — in-memory storage (no disk writes) ───────────────────
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB max
  fileFilter: (_req, file, cb) => {
    const ok = /\.(csv|txt)$/i.test(file.originalname);
    cb(ok ? null : new Error('Only CSV files are accepted.'), ok);
  },
});

// ─── Allowed enum values (mirrors Mongoose schema) ────────────────
const VALID_STATUSES = ['New', 'Contacted', 'Qualified', 'Proposal Sent', 'Won', 'Lost'];
const VALID_SOURCES  = ['Website', 'Referral', 'Social Media', 'Advertisement', 'Cold Call', 'Other'];

/** Sanitise & validate one row from the CSV */
function parseRow(row) {
  const name   = (row.name   || row.Name   || '').trim();
  const email  = (row.email  || row.Email  || '').trim().toLowerCase();
  const phone  = (row.phone  || row.Phone  || '').trim();
  const source = (row.source || row.Source || 'Other').trim();
  const status = (row.status || row.Status || 'New').trim();
  const product = (row.product || row.Product || '').trim();
  const value  = Number(row.value || row.Value || 0);

  if (!name || !email) return { error: `Missing name or email in row: ${JSON.stringify(row)}` };

  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  if (!emailOk) return { error: `Invalid email: ${email}` };

  const dateStr = (row.date || row.Date || '').trim();
  let createdAt = new Date();
  if (dateStr) {
    const parsed = new Date(dateStr);
    if (!isNaN(parsed.getTime())) {
      createdAt = parsed;
    }
  }

  return {
    doc: {
      name,
      email,
      phone,
      source: VALID_SOURCES.includes(source) ? source : 'Other',
      status: VALID_STATUSES.includes(status) ? status : 'New',
      product,
      value: isNaN(value) ? 0 : value,
      notes: [],
      createdAt,
    },
  };
}

// ─────────────────────────────────────────────────────────────────────
// POST /api/leads/upload   — Bulk-import leads from a CSV file
// ─────────────────────────────────────────────────────────────────────
exports.uploadLeadsCSV = [
  upload.single('file'),

  async (req, res) => {
    if (!req.file) {
      return res.status(400).json({ message: 'No CSV file received. Send file with field name "file".' });
    }

    const rows = [];
    const errors = [];

    // Parse the in-memory buffer via a readable stream
    await new Promise((resolve, reject) => {
      const readable = Readable.from(req.file.buffer.toString('utf-8'));
      readable
        .pipe(csv())
        .on('data', (row) => rows.push(row))
        .on('error', reject)
        .on('end', resolve);
    });

    if (rows.length === 0) {
      return res.status(400).json({ message: 'CSV file is empty or malformed.' });
    }

    const toInsert = [];
    for (const row of rows) {
      const { doc, error } = parseRow(row);
      if (error) errors.push(error);
      else toInsert.push(doc);
    }

    if (toInsert.length === 0) {
      return res.status(422).json({
        message: 'No valid rows found.',
        errors,
      });
    }

    // De-dupe by email — skip rows whose email already exists
    const existingEmails = new Set(
      (await Lead.find({ email: { $in: toInsert.map(d => d.email) } }, 'email'))
        .map(l => l.email)
    );

    const newDocs  = toInsert.filter(d => !existingEmails.has(d.email));
    const skipped  = toInsert.filter(d =>  existingEmails.has(d.email));

    let inserted = [];
    if (newDocs.length > 0) {
      inserted = await Lead.insertMany(newDocs, { ordered: false });
    }

    console.log(`[CRM] CSV Upload: ${inserted.length} inserted, ${skipped.length} skipped (duplicate email), ${errors.length} invalid rows`);

    return res.status(200).json({
      message: `Import complete.`,
      inserted: inserted.length,
      skipped:  skipped.length,
      errors,
    });
  },
];
