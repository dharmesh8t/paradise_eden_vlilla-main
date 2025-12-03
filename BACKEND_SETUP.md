# Paradise Eden Villa - Backend Setup Guide

## Overview
This document provides instructions for setting up and running the Paradise Eden Villa backend server. The backend is built with Node.js, Express, and MongoDB.

## Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud instance like MongoDB Atlas)
- npm or yarn

## Installation

### 1. Install Dependencies
```bash
npm install
# or
yarn install
```

### 2. Configure Environment Variables
```bash
# Copy the example file
cp .env.example .env

# Edit .env with your configuration
nano .env
```

### 3. Set Up MongoDB
- Local: Ensure MongoDB is running on localhost:27017
- Cloud: Get connection string from MongoDB Atlas and update MONGODB_URI

### 4. Configure Email (Gmail)
- Enable "Less secure app access" in Google Account
- Generate App Password (recommended)
- Update EMAIL_USER and EMAIL_PASSWORD in .env

### 5. Set Up Razorpay (Payment Gateway)
- Create account at https://razorpay.com
- Get Key ID and Key Secret from dashboard
- Update RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in .env

## Running the Server

```bash
# Development mode
node server.js

# The server will run on http://localhost:5000
```

## API Endpoints

### Bookings
- `POST /api/bookings` - Create new booking
- `GET /api/bookings` - Get all bookings

### Reviews
- `POST /api/reviews` - Add guest review
- `GET /api/reviews` - Get all reviews
- `GET /api/reviews/stats` - Get average rating

### Health Check
- `GET /api/health` - Server status

## Database Schema

### Booking Document
```javascript
{
  guestName: String,
  guestEmail: String,
  guestPhone: String,
  checkInDate: Date,
  checkOutDate: Date,
  numberOfGuests: Number,
  totalPrice: Number,
  paymentStatus: 'pending|completed|failed',
  createdAt: Date
}
```

### Review Document
```javascript
{
  guestName: String,
  guestEmail: String,
  rating: 1-5,
  comment: String,
  createdAt: Date
}
```

## Future Enhancements
- Calendar availability system
- Advanced payment processing
- Email notifications
- Gallery management
- 360 virtual tour
- SEO optimization
