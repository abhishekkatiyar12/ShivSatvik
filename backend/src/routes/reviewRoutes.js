const express = require('express');
const { addReview, updateReview } = require('../controllers/reviewController');
const auth = require('../middleware/auth');

const router = express.Router();

// Add review for a flat
router.post('/:id/review', auth, addReview);

// Edit review for a flat
router.put('/:id/review', auth, updateReview);

module.exports = router;
