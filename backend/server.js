const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const morgan = require('morgan');
const connectDB = require('./src/config/db')
const i18n = require('./src/config/i18n');

dotenv.config();
connectDB();

const app = express();
app.use(express.json());
app.use(cors());
app.use(morgan('dev'));
app.use(i18n.init);


// Routes
app.use('/api/auth', require('./src/routes/authRoutes'));
app.use('/api/flats', require('./src/routes/flatRoutes'));
app.use('/api/bookings', require('./src/routes/bookingRoutes'));
app.use('/api/payments', require('./src/routes/paymentRoutes'));
app.use('/api/reviews', require('./src/routes/reviewRoutes'));
app.use('/api/profile', require('./src/routes/profileRoutes'));
app.use('/api/admin', require('./src/routes/adminRoutes'));
app.use('/api/coupons', require('./src/routes/couponRoutes'));


app.get('/', (req, res) => res.send('ShivSatvik Homestay API Running'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
