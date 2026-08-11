# ATT System Deployment Guide

This guide provides step-by-step instructions for deploying the **Backend API to Render** and the **Frontend Web App to Vercel**.

---

## Part 1: Backend Deployment on Render

### Step 1: Create a Web Service on Render
1. Log in to [Render Dashboard](https://dashboard.render.com/).
2. Click **New +** $\rightarrow$ **Web Service**.
3. Select **Build and deploy from a Git repository** and connect `https://github.com/DukeDayata/ocdra-att`.
4. Configure the Web Service settings:
   - **Name**: `ocdra-att-backend` (or your preferred name)
   - **Region**: Oregon (US West) or closest region
   - **Root Directory**: `server`
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Instance Type**: `Free`

### Step 2: Set Environment Variables on Render
In the **Environment** tab of your Render service, add the following variables:

| Key | Example Value | Description |
| :--- | :--- | :--- |
| `NODE_ENV` | `production` | Production mode flag |
| `PORT` | `10000` | Port number assigned by Render |
| `MONGODB_URI` | `mongodb+srv://<user>:<password>@cluster.mongodb.net/att_db?retryWrites=true&w=majority` | Your MongoDB Atlas connection string |
| `CLIENT_URL` | `https://your-app-name.vercel.app` | Your Vercel frontend URL (set after Vercel deployment) |

5. Click **Create Web Service**.
6. Once deployed, copy your Render Service URL (e.g. `https://ocdra-att-backend.onrender.com`).

---

## Part 2: Frontend Deployment on Vercel

### Step 1: Import Project into Vercel
1. Log in to [Vercel Dashboard](https://vercel.com/dashboard).
2. Click **Add New...** $\rightarrow$ **Project**.
3. Import your GitHub repository: `DukeDayata/ocdra-att`.

### Step 2: Configure Vercel Build Settings
In the project setup screen:
- **Framework Preset**: `Vite`
- **Root Directory**: Click **Edit** and select `client`
- **Build Command**: `npm run build`
- **Output Directory**: `dist`

### Step 3: Add Environment Variables on Vercel
Expand **Environment Variables** and add:

| Key | Value | Description |
| :--- | :--- | :--- |
| `VITE_API_BASE_URL` | `https://ocdra-att-backend.onrender.com/api` | Your deployed Render backend URL + `/api` |

4. Click **Deploy**.

---

## Part 3: Final CORS Check

Once both services are deployed:
1. Go back to Render Dashboard $\rightarrow$ your backend service $\rightarrow$ **Environment**.
2. Set `CLIENT_URL` to your production Vercel URL (e.g. `https://ocdra-att.vercel.app`).
3. Save changes. Render will automatically redeploy the backend with proper CORS permission!
