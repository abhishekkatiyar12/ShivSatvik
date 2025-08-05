const express = require('express');
const { addFlat, getFlats } = require('../controllers/flatController');
const auth = require('../middleware/auth');

const router = express.Router();

// Admin - Add new flat
router.post('/', auth, addFlat);

// Get all flats (for customers)
router.get('/', getFlats);

module.exports = router;
