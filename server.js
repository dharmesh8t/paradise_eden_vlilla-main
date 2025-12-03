const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const nodemailer = require('nodemailer');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/paradise_eden_villa';
mongoose.connect(mongoUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

// Booking Schema
const bookingSchema = new mongoose.Schema({
  guestName: { type: String, required: true },
  guestEmail: { type: String, required: true },
  guestPhone: { type: String, required: true },
  checkInDate: { type: Date, required: true },
  checkOutDate: { type: Date, required: true },
  numberOfGuests: { type: Number, required: true },
  totalPrice: { type: Number, required: true },
  paymentId: { type: String },
  paymentStatus: { type: String, enum: ['pending', 'completed', 'failed'], default: 'pending' },
  specialRequests: String,
  createdAt: { type: Date, default: Date.now },
});

const Booking = mongoose.model('Booking', bookingSchema);

// Review Schema
const reviewSchema = new mongoose.Schema({
  guestName: { type: String, required: true },
  guestEmail: { type: String, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const Review = mongoose.model('Review', reviewSchema);

// Enquiry Schema
const enquirySchema = new mongoose.Schema({
 guestName: { type: String, required: true },
 guestEmail: { type: String, required: true },
 guestPhone: { type: String, required: true },
 subject: { type: String, required: true },
 message: { type: String, required: true },
 status: { type: String, enum: ['new', 'responded', 'closed'], default: 'new' },
 createdAt: { type: Date, default: Date.now },
});
const Enquiry = mongoose.model('Enquiry', enquirySchema);

// Email Configuration
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

// API Routes
app.post('/api/bookings', async (req, res) => {
  try {
    const booking = new Booking(req.body);
    await booking.save();
    res.status(201).json(booking);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.get('/api/bookings', async (req, res) => {
  try {
    const bookings = await Booking.find();
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/reviews', async (req, res) => {
  try {
    const review = new Review(req.body);
    await review.save();
    res.status(201).json(review);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.get('/api/reviews', async (req, res) => {
  try {
    const reviews = await Review.find().sort({ createdAt: -1 });
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/enquiries', async (req, res) => {
 try {
 const enquiry = new Enquiry(req.body);
 await enquiry.save();
 
 // Send confirmation email to customer
 const mailOptions = {
 from: process.env.EMAIL_USER,
 to: enquiry.guestEmail,
 subject: 'We received your enquiry - Paradise Eden Villa',
 html: `<h2>Thank you for your enquiry!</h2>
 <p>Hi ${enquiry.guestName},</p>
 <p>We have received your enquiry regarding <strong>${enquiry.subject}</strong>.</p>
 <p>Our team will review your message and get back to you as soon as possible.</p>
 <p><strong>Enquiry Details:</strong></p>
 <p>Subject: ${enquiry.subject}</p>
 <p>Message: ${enquiry.message}</p>
 <p>Phone: ${enquiry.guestPhone}</p>
 <br>
 <p>Best regards,<br>Paradise Eden Villa Team</p>`
 };
 
 transporter.sendMail(mailOptions, (error, info) => {
 if (error) console.log('Email error:', error);
 else console.log('Confirmation email sent:', info.response);
 });
 
 // Send notification email to admin (dharmesh8m@gmail.com)
 const adminMailOptions = {
 from: process.env.EMAIL_USER,
 to: 'dharmesh8m@gmail.com',
 subject: 'New Enquiry Received - Paradise Eden Villa',
 html: `<h2>New Customer Enquiry</h2>
 <p><strong>Name:</strong> ${enquiry.guestName}</p>
 <p><strong>Email:</strong> ${enquiry.guestEmail}</p>
 <p><strong>Phone:</strong> ${enquiry.guestPhone}</p>
 <p><strong>Subject:</strong> ${enquiry.subject}</p>
 <p><strong>Message:</strong></p>
 <p>${enquiry.message}</p>`
 };
 
 transporter.sendMail(adminMailOptions, (error, info) => {
 if (error) console.log('Admin email error:', error);
 else console.log('Admin notification sent:', info.response);
 });
 
 res.status(201).json({ message: 'Enquiry received successfully', enquiry });
 } catch (error) {
 res.status(400).json({ error: error.message });
 }
});

app.get('/api/enquiries', async (req, res) => {
 try {
 const enquiries = await Enquiry.find().sort({ createdAt: -1 });
 res.json(enquiries);
 } catch (error) {
 res.status(500).json({ error: error.message });
 }
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
