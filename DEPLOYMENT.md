# KrushiConnect — Deployment & MongoDB Atlas Troubleshooting Guide

We inspected your **MongoDB Atlas** database directly:
- **Connected Database**: `krushi_connect`
- **Existing Collections & Data Found**:
  - `equipment`: 8 machinery items (Tractors, Harvesters, Tillers, Sprayers, Cultivators, Seeders)
  - `users`: 5 registered accounts (Farmers & Equipment Owners)
  - `bookings`: 8 booking records
  - `notifications`: 41 notifications
  - `receipts`: 3 receipts

---

## Why listings were not displaying on the hosted website

1. **Images contained `http://localhost:5000/uploads/...`**:
   - The 8 equipment items in Atlas stored local URLs (`http://localhost:5000/...`).
   - On hosted sites or mobile devices, `localhost:5000` is unreachable from the visitor's browser.
   - **Fixed**: We added image sanitization on both backend `Equipment.toJSON()` and frontend `resolveImageUrl()`, plus an automatic `onError` fallback placeholder image.

2. **Frontend couldn'\''t find the Backend API**:
   - If frontend and backend are hosted on separate domains (e.g., Frontend on Vercel, Backend on Render), the frontend without `VITE_API_URL` tries to fetch from `/api` on Vercel (which has no backend, returning 404).
   - **Fixed**: See hosting instructions below.

3. **MongoDB Atlas Network Access Whitelist**:
   - MongoDB Atlas blocks all incoming connections by default unless the IP whitelist includes `0.0.0.0/0`.

---

## 🚀 How to Host Correctly

### Option A: All-In-One Fullstack Hosting on Render / Railway (Recommended & Easiest)

Both React Frontend and Express Backend run on the **same service**.

1. Create a **Web Service** on [Render](https://dashboard.render.com).
2. Connect your GitHub repository.
3. Configure the service:
   - **Environment**: Node
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `node server/dist/server.js`
4. Add **Environment Variables** in Render:
   | Variable | Value |
   |---|---|
   | `MONGODB_URI` | `mongodb+srv://pallavijanjal30_db_user:ZBnsl5hzxCPR9mXB@krushiconnect1.jwhvmnd.mongodb.net/krushi_connect?retryWrites=true&w=majority&appName=KrushiConnect1` |
   | `JWT_SECRET` | `Kc9!vR2xP7@Lm4$Qz8^Nw6&Ty1*Hs5` |
   | `CLIENT_URL` | `https://<your-render-service-name>.onrender.com` |
   | `NODE_ENV` | `production` |
   | `SMTP_HOST` | `smtp.gmail.com` |
   | `SMTP_PORT` | `587` |
   | `SMTP_SECURE` | `false` |
   | `SMTP_USER` | `hondaleshivani@gmail.com` |
   | `SMTP_PASS` | `xehxxddjnbggbsci` |
   | `EMAIL_FROM` | `"KrushiConnect <hondaleshivani@gmail.com>"` |
   | `CLOUDINARY_CLOUD_NAME` | `dcujnbj0u` |
   | `CLOUDINARY_API_KEY` | `528688469629972` |
   | `CLOUDINARY_API_SECRET` | `JLlDm82FkqwVW-r_7zTDf397DCQ` |
   | `MANDI_API_KEY` | `579b464db66ec23bdd00000198a3453aaf284442786c9aee5b4ac6be` |

---

### Option B: Frontend on Vercel + Backend on Render

If you deployed the frontend on Vercel and backend on Render:

1. **In Render (Backend API Service)**:
   - **Root Directory**: `server`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `node dist/server.js`
   - **Environment Variables**:
     - `MONGODB_URI`: `mongodb+srv://pallavijanjal30_db_user:ZBnsl5hzxCPR9mXB@krushiconnect1.jwhvmnd.mongodb.net/krushi_connect?retryWrites=true&w=majority&appName=KrushiConnect1`
     - `JWT_SECRET`: `Kc9!vR2xP7@Lm4$Qz8^Nw6&Ty1*Hs5`
     - `CLIENT_URL`: `https://<your-frontend-domain>.vercel.app`

2. **In Vercel (Frontend Project)**:
   - Go to **Project Settings** → **Environment Variables**
   - Add:
     - `VITE_API_URL`: `https://<your-render-backend-name>.onrender.com/api`
   - **Redeploy** the frontend on Vercel (so Vite can bundle the API URL into the client build).

---

## 🔑 MongoDB Atlas IP Whitelist (Must Do)

1. Go to [cloud.mongodb.com](https://cloud.mongodb.com) and log in.
2. Select cluster `KrushiConnect1`.
3. In the left navigation menu, click **Network Access**.
4. Click **+ Add IP Address**.
5. Click **Allow Access from Anywhere** (`0.0.0.0/0`).
6. Click **Confirm**.

---

## 🔍 Verification Checklist

1. Open `https://<your-app-url>/api/health` in your browser.
   - It should return:
     ```json
     {
       "status": "OK",
       "service": "Krushi Connect API",
       "database": "MongoDB Atlas"
     }
     ```
2. Open the homepage: all **8 equipment items** (Tractor, Harvester, Seeder, etc.) will display with their photos and prices.
3. Register a new account / Log in with an existing user.
4. Add new equipment: it will upload images and save to MongoDB Atlas in real time.
