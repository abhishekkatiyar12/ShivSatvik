const express = require('express');
const cors = require('cors');
const reviewRoutes = require('./routes/reviewRoutes');
const authRoutes = require('./routes/authRoutes');
const flatRoutes = require('./routes/flatRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const paymentRoutes = require('./routes/paymentRoutes');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/payment', paymentRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/flats', flatRoutes);
app.use('/api/flats', reviewRoutes);
app.use('/api/bookings', bookingRoutes);

module.exports = app;
