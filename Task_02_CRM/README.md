# Task 02 — Client Lead Management System (Mini CRM)

> **Part of the AyuraBlend Ecosystem Roadmap** — A full-stack CRM built as a companion to the AyuraBlend e-commerce backend.

---

## 📋 Overview

A professional, dark-themed **Client Lead Management System** built with the MERN stack. Track leads through your entire sales pipeline — from first contact to closed deal — with real-time status updates, notes, and a filterable dashboard.

### Key Features
- 📊 **Dashboard** with pipeline stat cards (Total, New, Won, Pipeline Value)
- 📋 **Leads Table** with live search, status filtering, and animated rows
- ➕ **Create Lead** modal with full form (name, email, phone, source, status, product, value)
- ✏️ **Edit Lead** modal with one-click status update pills and timestamped notes history
- 🗑️ **Delete Lead** with per-row confirmation
- 🔄 **All mutations persist to MongoDB** — status updates and notes survive a full page refresh

---

## 🏗️ Project Structure

```
Task_02_CRM/                        ← React + Vite Frontend
├── src/
│   ├── api/
│   │   └── axiosClient.ts          ← Axios instance (proxy → backend)
│   ├── components/
│   │   ├── DashboardLayout.tsx     ← Sidebar + topbar shell
│   │   ├── LeadsTable.tsx          ← Table, filters, stat cards
│   │   └── LeadModal.tsx           ← Create / Edit / Notes modal
│   ├── hooks/
│   │   └── useLeads.ts             ← All API operations + local state
│   ├── utils/
│   │   └── types.ts                ← Shared TypeScript interfaces
│   ├── App.tsx
│   ├── index.css                   ← Tailwind v4 + CRM design tokens
│   └── main.tsx
└── vite.config.ts                  ← Dev proxy → localhost:5001

Task_02_AyuraBlend/backend/         ← Existing Express + MongoDB Backend
├── controllers/
│   └── leadController.js           ← 6 CRUD handlers for leads
├── routes/
│   └── leadRoutes.js               ← Express router for /api/leads
├── models/
│   └── Lead.js                     ← Mongoose schema
└── server.js                       ← Entry point (leadRoutes registered)
```

---

## ⚙️ Prerequisites

| Tool | Version |
|------|---------|
| Node.js | v18+ |
| npm | v9+ |
| MongoDB | Running locally (default: `mongodb://127.0.0.1:27017/ayurablend`) |

---

## 🚀 Running the Project

### Step 1 — Start the Backend

The CRM uses the existing **AyuraBlend backend**. Navigate to it and start the server:

```bash
cd Task_02_AyuraBlend/backend
npm install          # First time only
npm run dev          # Starts with nodemon on port 5001
```

**Expected output:**
```
Server running on port 5001
MongoDB successfully connected
```

> **Note:** The backend reads from a `.env` file. Make sure `MONGO_URI` is set.
> Example: `MONGO_URI=mongodb://127.0.0.1:27017/ayurablend`

---

### Step 2 — Start the Frontend

In a **new terminal**, navigate to the CRM frontend:

```bash
cd Task_02_CRM
npm install          # First time only
npm run dev          # Starts Vite on port 5173
```

**Expected output:**
```
VITE v8.x  ready in ~1s
➜  Local: http://localhost:5173/
```

Open **http://localhost:5173** in your browser. ✅

> The Vite dev proxy automatically forwards all `/api/*` requests to `localhost:5001`, so **no CORS issues** during development.

---

## 🔌 API Endpoints

All endpoints are served by the AyuraBlend backend at `http://localhost:5001`.

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/leads` | Create a new lead |
| `GET` | `/api/leads` | Fetch all leads (supports `?status=`, `?source=`, `?search=`) |
| `GET` | `/api/leads/:id` | Fetch a single lead by ID |
| `PUT` | `/api/leads/:id/status` | Update lead status |
| `POST` | `/api/leads/:id/notes` | Add a note to a lead |
| `DELETE` | `/api/leads/:id` | Delete a lead |

### Lead Status Values
`New` → `Contacted` → `Qualified` → `Proposal Sent` → `Won` / `Lost`

### Lead Source Values
`Website`, `Referral`, `Social Media`, `Advertisement`, `Cold Call`, `Other`

---

## 🧪 Running the Integration Tests

An automated Node.js test suite covers all 7 API flows including **page-refresh persistence simulation**:

```bash
cd Task_02_AyuraBlend/backend

# Start the backend first (in another terminal), then:
node integration_test.js
```

**Expected output:** `28/28 tests passed — ALL TESTS PASSED`

Tests cover:
- ✅ Lead creation (POST) and field persistence
- ✅ Fetch by ID after write (DB read-back, not React state)
- ✅ Status update — then re-fetched from DB to confirm persistence
- ✅ Note addition — then re-fetched from DB to confirm persistence
- ✅ Full collection list
- ✅ Invalid status rejection (400)
- ✅ Delete and 404 confirmation

---

## 🎨 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend Framework | React 19 + TypeScript |
| Build Tool | Vite 8 |
| Styling | Tailwind CSS v4 + CSS Custom Properties |
| Animations | Framer Motion |
| Icons | Lucide React |
| HTTP Client | Axios |
| Routing | React Router DOM v7 |
| Backend | Node.js + Express 5 |
| Database | MongoDB + Mongoose |
| Dev Tooling | nodemon, oxlint |

---

## 📦 Environment Variables (Backend)

Create a `.env` file in `Task_02_AyuraBlend/backend/`:

```env
PORT=5001
MONGO_URI=mongodb://127.0.0.1:27017/ayurablend
```

---

## 🔮 Production Notes

For a production deployment:
1. Set `VITE_API_URL` in `Task_02_CRM/.env.production` to your deployed backend URL
2. Update the `axiosClient.ts` `baseURL` to use `import.meta.env.VITE_API_URL`
3. Configure CORS `allowedOrigins` in `server.js` to include your frontend domain
4. Run `npm run build` in `Task_02_CRM` and deploy the `dist/` folder to a static host (Vercel, Netlify, etc.)

---

*Built as part of the FUTURE_FS_01 internship — Task 02 of the AyuraBlend Ecosystem Roadmap.*
