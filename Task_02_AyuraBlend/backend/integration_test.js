#!/usr/bin/env node
/**
 * PHASE 3 - Integration Verification Test
 * Task 02 CRM ↔ Task 02 AyuraBlend Backend
 *
 * Tests: POST /api/leads, GET /api/leads/:id,
 *        PUT /api/leads/:id/status, POST /api/leads/:id/notes,
 *        DELETE /api/leads/:id
 *
 * Run: node integration_test.js
 * Prerequisite: backend running at http://localhost:5001
 */

const BASE_URL = 'http://localhost:5001/api/leads';

// ── Minimal fetch wrapper (no external deps needed) ──────────
const http = require('http');

function request(method, url, body) {
  return new Promise((resolve, reject) => {
    const parsed = new URL(url);
    const options = {
      hostname: parsed.hostname,
      port: parsed.port || 80,
      path: parsed.pathname,
      method,
      headers: { 'Content-Type': 'application/json' },
    };
    const req = http.request(options, res => {
      let data = '';
      res.on('data', chunk => (data += chunk));
      res.on('end', () => {
        try { resolve({ status: res.statusCode, body: JSON.parse(data) }); }
        catch { resolve({ status: res.statusCode, body: data }); }
      });
    });
    req.on('error', reject);
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

// ── Test runner ──────────────────────────────────────────────
let passed = 0;
let failed = 0;

function assert(label, condition, detail = '') {
  if (condition) {
    console.log(`  ✅ PASS — ${label}`);
    passed++;
  } else {
    console.error(`  ❌ FAIL — ${label}${detail ? ': ' + detail : ''}`);
    failed++;
  }
}

async function run() {
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('  PHASE 3 — CRM Integration Test Suite   ');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  let leadId;

  // ── 1. CREATE ─────────────────────────────────────────────
  console.log('1️⃣  POST /api/leads  (create lead)');
  try {
    const res = await request('POST', BASE_URL, {
      name:    'Integration Test Lead',
      email:   'test@crm-verify.dev',
      phone:   '9876543210',
      source:  'Website',
      status:  'New',
      product: 'Ayur Moringa Pack',
      value:   499,
    });
    assert('HTTP 201 returned',         res.status === 201, `got ${res.status}`);
    assert('Response has _id',          !!res.body._id);
    assert('Name persisted correctly',  res.body.name === 'Integration Test Lead');
    assert('Email persisted correctly', res.body.email === 'test@crm-verify.dev');
    assert('Status defaults to New',    res.body.status === 'New');
    assert('Value persisted correctly', res.body.value === 499);
    assert('Notes array is empty',      Array.isArray(res.body.notes) && res.body.notes.length === 0);
    leadId = res.body._id;
    console.log(`     → Lead ID: ${leadId}\n`);
  } catch (e) {
    console.error('  ❌ FATAL — Backend unreachable. Is it running on port 5001?', e.message);
    process.exit(1);
  }

  // ── 2. READ (persistence check) ───────────────────────────
  console.log('2️⃣  GET /api/leads/:id  (verify persistence after write)');
  const getRes = await request('GET', `${BASE_URL}/${leadId}`);
  assert('HTTP 200 returned',              getRes.status === 200,            `got ${getRes.status}`);
  assert('Same _id returned',              getRes.body._id === leadId);
  assert('Email matches (lowercase check)',getRes.body.email === 'test@crm-verify.dev');
  assert('Value matches',                  getRes.body.value === 499);
  assert('createdAt field exists',         !!getRes.body.createdAt);
  console.log();

  // ── 3. STATUS UPDATE ──────────────────────────────────────
  console.log('3️⃣  PUT /api/leads/:id/status  (update status → Qualified)');
  const statusRes = await request('PUT', `${BASE_URL}/${leadId}/status`, { status: 'Qualified' });
  assert('HTTP 200 returned',          statusRes.status === 200,        `got ${statusRes.status}`);
  assert('Status updated to Qualified',statusRes.body.status === 'Qualified');
  assert('Other fields unchanged',     statusRes.body.email === 'test@crm-verify.dev');
  console.log();

  // ── 3b. PERSIST CHECK — re-fetch after status update ──────
  console.log('3️⃣b GET /api/leads/:id  (status persistence after page refresh simulation)');
  const reGetRes = await request('GET', `${BASE_URL}/${leadId}`);
  assert('Status persists in DB (not just React state)', reGetRes.body.status === 'Qualified');
  console.log();

  // ── 4. ADD NOTE ───────────────────────────────────────────
  console.log('4️⃣  POST /api/leads/:id/notes  (add note)');
  const noteRes = await request('POST', `${BASE_URL}/${leadId}/notes`, {
    text: 'Phase 3 auto-verification note — persists correctly.',
    addedBy: 'Integration Test Runner',
  });
  assert('HTTP 201 returned',       noteRes.status === 201,       `got ${noteRes.status}`);
  assert('Notes array has 1 entry', noteRes.body.notes.length === 1);
  assert('Note text correct',       noteRes.body.notes[0].text === 'Phase 3 auto-verification note — persists correctly.');
  assert('addedBy correct',         noteRes.body.notes[0].addedBy === 'Integration Test Runner');
  console.log();

  // ── 4b. PERSIST CHECK — re-fetch after note ───────────────
  console.log('4️⃣b GET /api/leads/:id  (note persistence after page refresh simulation)');
  const reGetNoteRes = await request('GET', `${BASE_URL}/${leadId}`);
  assert('Note persists in DB (not just React state)', reGetNoteRes.body.notes.length === 1);
  assert('Status still Qualified after note add',      reGetNoteRes.body.status === 'Qualified');
  console.log();

  // ── 5. LIST (appears in collection) ───────────────────────
  console.log('5️⃣  GET /api/leads  (appears in full collection)');
  const listRes = await request('GET', BASE_URL);
  assert('HTTP 200 returned', listRes.status === 200, `got ${listRes.status}`);
  const found = Array.isArray(listRes.body) && listRes.body.some(l => l._id === leadId);
  assert('Created lead appears in list', found);
  console.log();

  // ── 6. INVALID STATUS REJECTION ──────────────────────────
  console.log('6️⃣  PUT /api/leads/:id/status  (invalid value — expect 400)');
  const badStatusRes = await request('PUT', `${BASE_URL}/${leadId}/status`, { status: 'INVALID_STATUS' });
  assert('HTTP 400 returned for invalid status', badStatusRes.status === 400, `got ${badStatusRes.status}`);
  console.log();

  // ── 7. DELETE (cleanup) ───────────────────────────────────
  console.log('7️⃣  DELETE /api/leads/:id  (cleanup test data)');
  const delRes = await request('DELETE', `${BASE_URL}/${leadId}`);
  assert('HTTP 200 returned',          delRes.status === 200, `got ${delRes.status}`);
  assert('Success message returned',   delRes.body.message?.includes('deleted'));
  console.log();

  // ── 7b. Confirm gone ──────────────────────────────────────
  console.log('7️⃣b GET /api/leads/:id  (confirm deletion — expect 404)');
  const goneRes = await request('GET', `${BASE_URL}/${leadId}`);
  assert('HTTP 404 returned after delete', goneRes.status === 404, `got ${goneRes.status}`);
  console.log();

  // ── Summary ───────────────────────────────────────────────
  const total = passed + failed;
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`  Results: ${passed}/${total} tests passed`);
  if (failed === 0) {
    console.log('  🎉 ALL TESTS PASSED — CRM backend is production-ready!');
  } else {
    console.log(`  ⚠️  ${failed} test(s) failed — review above.`);
  }
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  process.exit(failed === 0 ? 0 : 1);
}

run().catch(err => {
  console.error('\n❌ FATAL ERROR:', err.message);
  process.exit(1);
});
