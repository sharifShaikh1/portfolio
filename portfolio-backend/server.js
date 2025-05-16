const express = require('express');
const mongoose = require('mongoose');
const nodemailer = require('nodemailer');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Log environment variables to debug
{/**console.log('MONGODB_URI:', process.env.MONGODB_URI);
console.log('EMAIL_USER:', process.env.EMAIL_USER);
console.log('EMAIL_PASS:', process.env.EMAIL_PASS); */}

// Check environment variables
if (!process.env.MONGODB_URI || !process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
  console.error('Error: MONGODB_URI, EMAIL_USER, or EMAIL_PASS is not defined in the .env file.');
  process.exit(1);
}

// Middleware
app.use(express.json());
app.use(cors({
  origin: ['https://sharif-portfolio-egkmzb9re-sharifs-projects-dbe6c303.vercel.app', 'http://localhost:5173'],
  methods: ['POST', 'GET', 'OPTIONS'],
  allowedHeaders: ['Content-Type'],
}));

<<<<<<< HEAD
// MongoDB Connection
=======

app.get('/api/contact', (req, res) => {
  res.status(200).json({ message: 'GET request to /api/contact works!' });
});
// MongoDB Connection (remove deprecated options)
>>>>>>> f5d74027b02e4172528104dfa76cadb5e8a6c678
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Define Contact Schema
const contactSchema = new mongoose.Schema({
  name: String,
  email: String,
  message: String,
  date: { type: Date, default: Date.now },
});

const Contact = mongoose.model('Contact', contactSchema);

// Nodemailer Transport
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// API Routes
app.get('/api/contact', (req, res) => {
  res.status(200).json({ message: 'GET request to /api/contact works!' });
});

app.post('/api/contact', async (req, res) => {
  const { name, email, message } = req.body;

  // Input validation
  if (!name || !email || !message) {
    return res.status(400).json({ message: 'All fields are required.' });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ message: 'Invalid email address.' });
  }

  try {
    // Save to MongoDB
    const newContact = new Contact({ name, email, message });
    await newContact.save();

    // Send Email
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      subject: 'New Contact Form Submission',
      text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'Form submitted successfully!' });
  } catch (error) {
    console.error('Error processing form:', error);
    res.status(500).json({ message: 'Error submitting form. Please try again.' });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});