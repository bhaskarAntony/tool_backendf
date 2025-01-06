const express = require('express');
const router = express.Router();
const Ammunition = require('../models/Ammunition');

// Middleware to validate request body for creating/updating ammunition
const validateAmmunition = (req, res, next) => {
  const { title, bundleCount, dateOfUpload, emptyCasesCount, firedCount, description } = req.body;
  if (!title || !bundleCount || !dateOfUpload || !emptyCasesCount || !firedCount || !description) {
    return res.status(400).json({ error: 'All required fields must be provided.' });
  }
  next();
};

// Create Ammunition
router.post('/', validateAmmunition, async (req, res) => {
  try {
    const newAmmunition = new Ammunition(req.body);
    const savedAmmunition = await newAmmunition.save();
    res.status(201).json(savedAmmunition);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get All Ammunitions
router.get('/', async (req, res) => {
  try {
    const ammunitions = await Ammunition.find();
    res.status(200).json(ammunitions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get Ammunition by ID
router.get('/:id', async (req, res) => {
  try {
    const ammunition = await Ammunition.findById(req.params.id);
    if (!ammunition) {
      return res.status(404).json({ error: 'Ammunition not found.' });
    }
    res.status(200).json(ammunition);
  } catch (err) {
    res.status(400).json({ error: 'Invalid ID format.' });
  }
});

// Search Ammunitions (by title or status)
router.get('/search', async (req, res) => {
  const { title, status } = req.query;
  try {
    const filter = {};
    if (title) filter.title = new RegExp(title, 'i'); // Case-insensitive search
    if (status) filter.status = status;

    const ammunitions = await Ammunition.find(filter);
    res.status(200).json(ammunitions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update Ammunition
router.put('/:id', validateAmmunition, async (req, res) => {
  try {
    const updatedAmmunition = await Ammunition.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedAmmunition) {
      return res.status(404).json({ error: 'Ammunition not found.' });
    }
    res.status(200).json(updatedAmmunition);
  } catch (err) {
    res.status(400).json({ error: 'Invalid ID format or validation error.' });
  }
});

// Delete Ammunition
router.delete('/:id', async (req, res) => {
  try {
    const deletedAmmunition = await Ammunition.findByIdAndDelete(req.params.id);
    if (!deletedAmmunition) {
      return res.status(404).json({ error: 'Ammunition not found.' });
    }
    res.status(200).json({ message: 'Ammunition deleted successfully.' });
  } catch (err) {
    res.status(500).json({ error: 'Invalid ID format.' });
  }
});

module.exports = router;
