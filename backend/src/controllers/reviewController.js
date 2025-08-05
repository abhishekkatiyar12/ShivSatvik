const Flat = require('../models/Flat');

// Add review
exports.addReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const flat = await Flat.findById(req.params.id);

    if (!flat) return res.status(404).json({ message: 'Flat not found' });

    const alreadyReviewed = flat.reviews.find(
      r => r.user.toString() === req.user.id.toString()
    );

    if (alreadyReviewed) {
      return res.status(400).json({ message: 'You already reviewed this flat' });
    }

    const review = {
      user: req.user.id,
      name: req.user.name,
      rating: Number(rating),
      comment
    };

    flat.reviews.push(review);
    flat.averageRating =
      flat.reviews.reduce((acc, item) => item.rating + acc, 0) / flat.reviews.length;

    await flat.save();
    res.status(201).json({ message: 'Review added', reviews: flat.reviews });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update review
exports.updateReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const flat = await Flat.findById(req.params.id);

    if (!flat) return res.status(404).json({ message: 'Flat not found' });

    const review = flat.reviews.find(
      r => r.user.toString() === req.user.id.toString()
    );

    if (!review) return res.status(404).json({ message: 'Review not found' });

    review.rating = rating || review.rating;
    review.comment = comment || review.comment;

    flat.averageRating =
      flat.reviews.reduce((acc, item) => item.rating + acc, 0) / flat.reviews.length;

    await flat.save();
    res.json({ message: 'Review updated', review });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
