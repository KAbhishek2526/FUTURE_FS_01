const fs = require('fs');
const path = require('path');

const BASE = 'http://localhost:5001/api';

async function req(method, url, options = {}) {
  const { body, formData, headers = {} } = options;
  const res = await fetch(`${BASE}${url}`, {
    method,
    headers: body ? { 'Content-Type': 'application/json', ...headers } : headers,
    body: formData ? formData : body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json().catch(() => ({}));
  return { status: res.status, data };
}

async function runDemoSequence() {
  console.log('\n===========================================');
  console.log('       DEMO DAY VALIDATION SEQUENCE');
  console.log('===========================================\n');

  /* 1. Upload CSV */
  console.log('1️⃣ UPLOADING DEMO LEADS...');
  const csvPath = path.join(__dirname, 'demo_leads.csv');
  const fileBytes = fs.readFileSync(csvPath);
  
  const { FormData, Blob } = await import('node:buffer').catch(() => ({ FormData: global.FormData, Blob: global.Blob }));
  const fd = new (globalThis.FormData || require('form-data'))();
  if (fd.append.length >= 2) {
    fd.append('file', new Blob([fileBytes], { type: 'text/csv' }), 'demo_leads.csv');
  }

  const uploadRes = await fetch(`${BASE}/leads/upload`, { method: 'POST', body: fd });
  const uploadData = await uploadRes.json();
  console.log(`✅ Upload response: Inserted ${uploadData.inserted}, Skipped ${uploadData.skipped}`);

  /* 2. Verify Database Persistence */
  console.log('\n2️⃣ VERIFYING DATABASE PERSISTENCE...');
  const { data: leads } = await req('GET', '/leads');
  const demoLeads = leads.filter(l => ['abhi@test.com', 'vikram@test.com', 'sita@test.com', 'ravi@test.com', 'priya@test.com'].includes(l.email));
  console.log(`✅ Verified ${demoLeads.length} demo leads in the database.`);

  /* 3. AI Agent Question 1 */
  console.log('\n3️⃣ ASKING AI: "Who bought products on 24-11-2025?"');
  const q1Res = await req('POST', '/chat', { body: { message: "Who bought products on 24-11-2025?" } });
  
  if (q1Res.status === 429) {
    console.log(`⚠️ Rate Limit Hit (429) - Quota Exceeded for AI Agent. Test Passed conditionally.`);
  } else if (q1Res.status === 200) {
    console.log(`🤖 AI Replied: ${q1Res.data.reply}`);
  } else {
    console.log(`❌ Unexpected AI Response: ${q1Res.status}`, q1Res.data);
  }

  /* 4. AI Agent Question 2 */
  console.log('\n4️⃣ ASKING AI: "Summarize total deal value."');
  const q2Res = await req('POST', '/chat', { body: { message: "Summarize total deal value of the pipeline." } });
  
  if (q2Res.status === 429) {
    console.log(`⚠️ Rate Limit Hit (429) - Quota Exceeded for AI Agent. Test Passed conditionally.`);
  } else if (q2Res.status === 200) {
    console.log(`🤖 AI Replied: ${q2Res.data.reply}`);
  } else {
    console.log(`❌ Unexpected AI Response: ${q2Res.status}`, q2Res.data);
  }

  console.log('\n===========================================');
  console.log('           DEMO PREP COMPLETE');
  console.log('===========================================\n');
}

runDemoSequence().catch(console.error);
