# Authority to Travel (ATT) Generator System (MERN Stack)

A complete, production-ready web application built with the MERN stack (MongoDB, Express.js, React with Vite, Node.js) converting the legacy Google Apps Script & Google Sheets–based **Authority to Travel (ATT) Generator System** for the Commission on Higher Education (CHED).

---

## 🌟 Features

- **Dual ATT Request Workflow**: Easily create **Local** and **Abroad** Authority to Travel records.
- **Personnel & Signatory Matrix**: Select staff members with position auto-population and duplicate checks.
- **Unique Reference Numbering**: Automatic server-side generation of sequential reference numbers (`ATT-LOC-YYYY-#####` and `ATT-INT-YYYY-#####`) with atomic retry logic.
- **Official Print Templates**: Pixel-faithful Local and Abroad printable document templates matching official CHED headers, footers, checkboxes, formatting, and designated travel arrangers (`DUKE VINCENT PAUL DAYATA`). Zero dependence on `localStorage`.
- **Comprehensive Admin Dashboard**: Search, filter by type/status/date range, paginated tables (10, 25, 50, 100 per page), status updates, and audit trail timeline.
- **Master Data Management**: CRUD operations for Personnel registry and Approver signatories.
- **Legacy Migration Support**: Built-in CLI migration tool to import legacy CSV/JSON backups from Google Sheets while preserving historical reference numbers and statuses.

---

## 📁 Project Structure

```text
ATT OCDRA/
├── client/                      # React + Vite Frontend
│   ├── src/
│   │   ├── components/          # Reusable Form, Admin & UI components
│   │   ├── pages/               # MainPortal, CreateATTPage, AdminDashboard, Print Pages
│   │   ├── services/            # Axios API Service
│   │   ├── utils/               # Formatters & Helpers
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.js
├── server/                      # Express + Node.js Backend
│   ├── src/
│   │   ├── config/              # MongoDB Connection
│   │   ├── controllers/         # ATT, Personnel, Approver controllers
│   │   ├── middleware/          # Security, Rate limiting, Error handling
│   │   ├── models/              # Mongoose Schemas (ATTRecord, Personnel, Approver)
│   │   ├── routes/              # Express API Routes
│   │   ├── scripts/             # Seed & Legacy Migration scripts
│   │   ├── utils/               # Unique Ref Generator & API Helpers
│   │   └── server.js
│   └── package.json
├── .env.example
└── README.md
```

---

## 🚀 Quick Start & Local Setup

### 1. Prerequisites
- **Node.js**: v18.x or higher
- **MongoDB**: Local MongoDB server or a free MongoDB Atlas connection URI

### 2. Backend Setup
```bash
cd server
npm install
```

Create `server/.env`:
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/att_db
CLIENT_URL=http://localhost:5173
```

Seed initial master data (Personnel & Approvers):
```bash
npm run seed
```

Start backend development server:
```bash
npm run dev
```

### 3. Frontend Setup
In a new terminal window:
```bash
cd client
npm install
```

Create `client/.env`:
```env
VITE_API_BASE_URL=http://localhost:5000/api
```

Start Vite development server:
```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 📊 Legacy Data Migration Guide

To import legacy records from Google Sheets into MongoDB:

1. Open your legacy Google Sheet (`ATT_Records` / `Personnel` / `Chairman`).
2. Go to **File → Download → Comma Separated Values (.csv)**.
3. Save the exported `.csv` or `.json` file into `server/data/` (e.g., `server/data/ATT_Records.csv`).
4. Run the migration script:
   ```bash
   cd server
   npm run migrate -- --file=data/ATT_Records.csv
   ```
5. The migration script will parse the legacy JSON Backup field if present, maintain original reference numbers (`ATT-LOC-...`), record historical statuses, and print a summary report.

---

## 📡 REST API Reference

### Personnel
- `GET /api/personnel` — List all active personnel
- `POST /api/personnel` — Add new personnel
- `GET /api/personnel/:id` — Get personnel details
- `PUT /api/personnel/:id` — Update personnel
- `PATCH /api/personnel/:id/status` — Toggle active status

### Approvers
- `GET /api/approvers` — List all approvers
- `POST /api/approvers` — Add new approver
- `GET /api/approvers/:id` — Get approver details
- `PUT /api/approvers/:id` — Update approver
- `PATCH /api/approvers/:id/status` — Toggle active status

### ATT Records
- `POST /api/att` — Create new ATT record (auto-generates refNo)
- `GET /api/att` — Query records with pagination (`page`, `limit`, `search`, `attType`, `status`, `startDate`, `endDate`, `sortBy`)
- `GET /api/att/stats` — Get metric counts for dashboard
- `GET /api/att/reference/:referenceNo` — Fetch record by reference number (used by print templates)
- `PATCH /api/att/:id/status` — Update record status & append to audit trail
- `PATCH /api/att/:id/archive` — Toggle archival status

---

## 🌐 Production Deployment Instructions

### 1. Database (MongoDB Atlas)
1. Create a free cluster on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Create a database user and whitelist your backend server IP (or `0.0.0.0/0`).
3. Copy your MongoDB connection string (`mongodb+srv://...`).

### 2. Backend (Render / DigitalOcean)
1. Deploy the `server/` directory as a Node.js Web Service on **Render**, **DigitalOcean App Platform**, or **Railway**.
2. Build command: `npm install`
3. Start command: `npm start`
4. Configure Environment Variables:
   - `PORT`: `5000` (or dynamic port assigned by host)
   - `NODE_ENV`: `production`
   - `MONGODB_URI`: `your_mongodb_atlas_connection_string`
   - `CLIENT_URL`: `https://your-frontend-app.vercel.app`

### 3. Frontend (Vercel / Netlify)
1. Deploy the `client/` directory to **Vercel** or **Netlify**.
2. Framework Preset: `Vite`
3. Build command: `npm run build`
4. Output directory: `dist`
5. Configure Environment Variables:
   - `VITE_API_BASE_URL`: `https://your-backend-api.onrender.com/api`

---

## 📄 License
Created for Commission on Higher Education (CHED). Internal Government Use.
