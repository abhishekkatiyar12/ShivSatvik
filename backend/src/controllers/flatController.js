const Flat = require('../models/Flat');

exports.addFlat = async (req, res) => {
  try {
    const flat = await Flat.create(req.body);
    res.json(flat);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getFlats = async (req, res) => {
  try {
    const flats = await Flat.find();
    res.json(flats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
