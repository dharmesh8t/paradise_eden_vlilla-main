# Paradise Eden Villa - Deployment Guide

## Quick Start

This guide provides step-by-step instructions to host the Paradise Eden Villa website with a full-stack setup:
- **Frontend**: Vercel (HTML/CSS/JavaScript)
- **Backend**: Render (Node.js/Express API server)
- **Database**: MongoDB Atlas (Free tier 512MB)
- **Email**: Gmail (Nodemailer)

---

## Part 1: Set up MongoDB Database (5 minutes)

### Step 1: Create MongoDB Atlas Account
1. Go to [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Sign up for free account
3. Verify email address

### Step 2: Create Free Cluster
1. Click "Create" → Choose free tier (M0 Sandbox)
2. Select cloud provider: AWS, Azure, or GCP (choose closest to you)
3. Select region and create cluster
4. Wait 5 minutes for cluster creation

### Step 3: Get Connection String
1. Go to Deployments → Database
2. Click "Connect" button
3. Choose "Drivers" → Node.js
4. Copy connection string (format: `mongodb+srv://username:password@cluster.mongodb.net/dbname`)
5. Save this for later use

### Step 4: Create Database User
1. Go to Database Access
2. Add New Database User
3. Username: any name (e.g., `paradise_admin`)
4. Password: generate strong password
5. Save username and password

---

## Part 2: Deploy Backend on Render (10 minutes)

### Step 1: Create Render Account
1. Go to [render.com](https://render.com)
2. Click "Get Started" → Sign in with GitHub
3. Authorize Render to access your repositories

### Step 2: Create Web Service
1. Dashboard → New → Web Service
2. Select "paradise_eden_vlilla" repository
3. Choose main branch
4. Configure settings:
   - **Name**: `paradise-eden-villa-api`
   - **Runtime**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
   - **Root Directory**: `./` (leave default)

### Step 3: Add Environment Variables
In Render dashboard, go to Environment and add:

```
MONGODB_URI=mongodb+srv://paradise_admin:YOUR_PASSWORD@cluster.mongodb.net/paradise_eden_villa
PORT=5000
NODE_ENV=production
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
RAZORPAY_KEY_ID=your-key
RAZORPAY_SECRET=your-secret
```

**Important**: Replace `YOUR_PASSWORD` with the actual database password from Step 1.4

### Step 4: Deploy
1. Click "Create Web Service"
2. Wait for deployment (2-3 minutes)
3. Copy the generated URL (e.g., `https://paradise-eden-villa-api.onrender.com`)
4. Save this URL for frontend configuration

---

## Part 3: Deploy Frontend on Vercel (10 minutes)

### Step 1: Create Vercel Account
1. Go to [vercel.com](https://vercel.com)
2. Sign in with GitHub
3. Authorize Vercel

### Step 2: Import Project
1. Dashboard → New Project → Import Git Repository
2. Find and select `paradise_eden_vlilla`
3. Click Import

### Step 3: Configure Project
1. **Project Name**: `paradise-eden-villa`
2. **Framework**: Choose "Other"
3. **Root Directory**: `./public` (or leave default if no public folder)
4. **Build Command**: Leave empty
5. **Output Directory**: Leave empty

### Step 4: Add Environment Variables
In Vercel Project Settings → Environment Variables, add:

```
VITE_API_URL=https://paradise-eden-villa-api.onrender.com
```

Replace with your actual Render backend URL from Part 2, Step 4

### Step 5: Deploy
1. Click "Deploy"
2. Wait for deployment (1-2 minutes)
3. Copy your Vercel deployment URL (e.g., `https://paradise-eden-villa.vercel.app`)

---

## Part 4: Configure Email (Gmail SMTP)

### Step 1: Enable Gmail App Password
1. Go to [myaccount.google.com](https://myaccount.google.com)
2. Select "Security" (left sidebar)
3. Enable "2-Step Verification" if not already enabled
4. Go to "App passwords"
5. Select "Mail" and "Windows Computer" (or your device)
6. Generate app password (16 characters)
7. Copy and save this password

### Step 2: Update Render Environment Variables
1. Go to Render Dashboard → Your Web Service
2. Environment → Edit
3. Update:
   - `EMAIL_USER`: Your full Gmail address (e.g., `dharmesh8m@gmail.com`)
   - `EMAIL_PASSWORD`: The 16-character app password from above
4. Save and redeploy

---

## Part 5: Test the Deployment

### Test Backend
1. Open: `https://your-render-url/api/health`
2. Should see: `{"status":"OK"}`

### Test Frontend
1. Go to your Vercel URL
2. Test contact form:
   - Fill in all fields
   - Click "Send Enquiry"
   - Check for success message
   - Check `dharmesh8m@gmail.com` for enquiry notification

### Test Email System
1. Submit an enquiry through the website
2. Check:
   - Admin receives email at `dharmesh8m@gmail.com`
   - Customer receives confirmation email
   - All details are correct

---

## Part 6: Custom Domain (Optional)

### For Backend (Render)
1. Render Dashboard → Web Service → Settings
2. Custom Domains → Add
3. Enter your domain (e.g., `api.paradiseeden villa.com`)
4. Follow DNS configuration steps

### For Frontend (Vercel)
1. Vercel Project → Settings → Domains
2. Add Domain
3. Enter your domain (e.g., `www.paradiseeden villa.com`)
4. Configure DNS records (Vercel will provide instructions)

---

## Environment Variables Reference

### MongoDB URI Format
```
mongodb+srv://username:password@cluster-url.mongodb.net/database-name
```

### Email Configuration
- **Gmail SMTP**: `smtp.gmail.com:587`
- **EMAIL_USER**: Full Gmail address with app password
- **EMAIL_PASSWORD**: 16-character app-specific password (NOT your Google password)

### Razorpay (Optional, for payments)
- Get keys from [Razorpay Dashboard](https://razorpay.com)
- Add to environment variables

---

## Troubleshooting

### Backend won't deploy
- Check `npm install` completes without errors
- Verify all environment variables are set
- Check Render logs for error messages

### Frontend shows blank page
- Verify API URL is correctly configured
- Check browser console for errors
- Verify CORS is enabled on backend

### Emails not sending
- Verify Gmail app password (not regular password)
- Check 2-Factor Authentication is enabled
- Verify EMAIL_USER and EMAIL_PASSWORD in backend

### Database connection error
- Verify MongoDB connection string is correct
- Check IP whitelist in MongoDB Atlas (allow all IPs for now)
- Verify username and password

---

## Security Checklist

- [ ] Never commit `.env` file to GitHub
- [ ] Use strong passwords for database users
- [ ] Enable MongoDB IP whitelist (restricted to Render server IPs)
- [ ] Enable HTTPS on both frontend and backend
- [ ] Regularly update dependencies
- [ ] Monitor error logs for suspicious activity

---

## Costs

**Monthly Cost**: FREE (or minimal)
- MongoDB Atlas: Free tier (512MB storage)
- Render: Free tier + paid tier ($7/month)
- Vercel: Free tier + paid tier ($20/month)
- Gmail: Free
- Razorpay: Free (charges ~2.3% on transactions)

**Total**: $27/month (or free on free tiers)

---

## Next Steps

1. Set up monitoring and logging
2. Configure daily database backups
3. Set up email alerts for errors
4. Create CI/CD pipeline for automatic deployments
5. Add custom domain for branding

---

## Support

For issues or questions:
- Check error logs in Render/Vercel dashboards
- Review MongoDB Atlas documentation
- Contact hosting providers' support teams
