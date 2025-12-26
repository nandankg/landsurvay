# Bihar Land Survey - Render.com Deployment Guide
9631131115-Rohit Gupta 
This guide walks you through deploying the Bihar Land Survey application to Render.com's free tier.

r primary URL https://bihar-land-api.onrender.com
==> 
==> Available at your primary URL https://bihar-land-api.onrender.com

## Prerequisites

1. **GitHub Account**: Push your code to a GitHub repository
2. **Render.com Account**: Sign up at https://render.com (free)
3. **Working Local Setup**: Ensure the app works locally first

---

## Step 1: Push Code to GitHub

```bash
# Initialize git if not already done
cd D:\land
git init

# Create .gitignore
echo "node_modules/" > .gitignore
echo ".env" >> .gitignore
echo "dist/" >> .gitignore
echo "uploads/documents/*" >> .gitignore
echo "!uploads/documents/.gitkeep" >> .gitignore

# Add and commit
git add .
git commit -m "Initial commit: Bihar Land Survey application"

# Create repository on GitHub, then:
git remote add origin https://github.com/YOUR_USERNAME/bihar-land-survey.git
git branch -M main
git push -u origin main
```

---

## Step 2: Create PostgreSQL Database on Render

1. Go to https://dashboard.render.com
2. Click **New +** → **PostgreSQL**
3. Configure:
   - **Name**: `bihar-land-db`
   - **Database**: `bihar_land`
   - **User**: `bihar_admin`
   - **Region**: Singapore (or nearest to users)
   - **Plan**: Free
4. Click **Create Database**
5. Wait for creation (2-3 minutes)
6. Copy the **Internal Database URL** (starts with `postgresql://`)

> **Note**: Free tier databases expire after 90 days. Set a reminder to backup data.

---

## Step 3: Deploy Backend API

1. Click **New +** → **Web Service**
2. Connect your GitHub repository
3. Configure:
   - **Name**: `bihar-land-api`
   - **Region**: Singapore (same as database)
   - **Branch**: `main`
   - **Root Directory**: `backend`
   - **Runtime**: Node
   - **Build Command**: `npm install && npx prisma generate && npx prisma db push`
   - **Start Command**: `npm start`
   - **Plan**: Free

4. Add **Environment Variables**:
   | Key | Value |
   |-----|-------|
   | `DATABASE_URL` | (paste Internal Database URL from Step 2) |
   | `JWT_SECRET` | (click Generate to create secure random value) |
   | `NODE_ENV` | `production` |
   | `PORT` | `3000` |
   | `MAX_FILES` | `7` |

5. Add **Disk** (for document uploads):
   - Click **Add Disk**
   - **Name**: `uploads`
   - **Mount Path**: `/opt/render/project/src/uploads`
   - **Size**: 1 GB

6. Click **Create Web Service**
7. Wait for deployment (5-10 minutes)
8. Note your backend URL: `https://bihar-land-api.onrender.com`

### Seed Initial Data

After deployment, run this in Render Shell (Dashboard → bihar-land-api → Shell):

```bash
npx prisma db seed
```

---

## Step 4: Deploy Admin Portal

1. Click **New +** → **Static Site**
2. Connect same GitHub repository
3. Configure:
   - **Name**: `bihar-land-admin`
   - **Branch**: `main`
   - **Root Directory**: `admin`
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist`

4. Add **Environment Variable**:
   | Key | Value |
   |-----|-------|
   | `VITE_API_URL` | `https://bihar-land-api.onrender.com/api` |

5. Click **Create Static Site**
6. Wait for deployment (3-5 minutes)
7. Your admin portal URL: `https://bihar-land-admin.onrender.com`

---

## Step 5: Configure Routing (Admin Portal)

Add rewrite rule for SPA routing:

1. Go to **bihar-land-admin** dashboard
2. Click **Redirects/Rewrites**
3. Add rule:
   - **Source**: `/*`
   - **Destination**: `/index.html`
   - **Action**: Rewrite

---

## Step 6: Verify Deployment

### Test Backend API

```bash
# Health check
curl https://bihar-land-api.onrender.com/api/health

# Search endpoint
curl https://bihar-land-api.onrender.com/api/search/mobile/9876543210
```

### Test Admin Portal

1. Open `https://bihar-land-admin.onrender.com`
2. Login with: `admin` / `admin123`
3. Verify dashboard loads with statistics

---

## Free Tier Limitations & Workarounds

| Limitation | Impact | Workaround |
|------------|--------|------------|
| **Cold starts** | First request after 15min idle takes ~30s | Show loading spinner, use health check ping |
| **512MB RAM** | Limited concurrent users | Optimize queries, paginate results |
| **1GB disk** | Limited document storage | Compress images with Sharp, limit uploads |
| **90-day DB** | Database expires | Export data monthly, recreate before expiry |
| **750 hours/month** | Enough for single service 24/7 | Monitor usage in dashboard |

### Keep Service Warm (Optional)

Use a free cron service like UptimeRobot or cron-job.org to ping your API every 14 minutes:

```
URL: https://bihar-land-api.onrender.com/api/health
Interval: Every 14 minutes
```

---

## Troubleshooting

### Backend Not Starting

1. Check logs: Dashboard → bihar-land-api → Logs
2. Common issues:
   - **Prisma client not generated**: Ensure build command includes `npx prisma generate`
   - **Database connection failed**: Verify DATABASE_URL is correct
   - **Port conflict**: Render sets PORT automatically, ensure app uses `process.env.PORT`

### Admin Portal Shows Blank Page

1. Check browser console for errors
2. Verify VITE_API_URL is set correctly
3. Ensure SPA rewrite rule is configured

### CORS Errors

Backend already configured for CORS. If issues persist, check:
```javascript
// backend/src/app.js
app.use(cors({
  origin: ['https://bihar-land-admin.onrender.com', 'http://localhost:5173'],
  credentials: true
}))
```

### Database Connection Timeout

Free tier databases sleep after inactivity. First connection may timeout. Retry after 30 seconds.

---

## Post-Deployment Checklist

- [ ] Backend API responding at `/api/health`
- [ ] Admin login working
- [ ] Dashboard showing statistics
- [ ] Can create/edit owners
- [ ] Can create/edit properties
- [ ] Document upload working
- [ ] CSV import working
- [ ] Search endpoints returning data

---

## Updating Deployed Application

### Update Backend

```bash
git add .
git commit -m "Update backend"
git push origin main
```

Render auto-deploys on push. For database migrations:

```bash
# In Render Shell
npx prisma migrate deploy
```

### Update Admin Portal

Same process - push to GitHub, Render auto-deploys.

---

## Production Considerations

For production use beyond free tier:

1. **Upgrade to Starter Plan** ($7/month per service)
   - No cold starts
   - More RAM and disk
   - Persistent database

2. **Use External PostgreSQL**
   - Supabase, Neon, or Railway (free tiers available)
   - Better uptime and no 90-day limit

3. **CDN for Documents**
   - Cloudflare R2 or AWS S3 for document storage
   - Better performance and unlimited storage

4. **Custom Domain**
   - Add custom domain in Render dashboard
   - Free SSL included

---

## URLs Summary

| Service | URL |
|---------|-----|
| Backend API | `https://bihar-land-api.onrender.com` |
| Admin Portal | `https://bihar-land-admin.onrender.com` |
| API Health | `https://bihar-land-api.onrender.com/api/health` |

**Default Login**: `admin` / `admin123`

---

*Deployment guide created for Bihar Land Survey & Revenue application*
